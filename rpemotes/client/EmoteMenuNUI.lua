-- Simple NUI wrapper for EmoteMenu
-- Uses all data and functions from EmoteMenu.lua

local isMenuOpen = false

-- Helper functions for preview
local function hasClonedPed()
    return ClonedPed and DoesEntityExist(ClonedPed)
end

local function isEmoteTypePreviewable(emoteType)
    return emoteType == EmoteType.DANCES
        or emoteType == EmoteType.EMOTES
        or emoteType == EmoteType.EXPRESSIONS
        or emoteType == EmoteType.PROP_EMOTES
        or emoteType == EmoteType.ANIMAL_EMOTES
        or emoteType == EmoteType.SHARED
        or emoteType == "EXPRESSIONS" -- For string comparison
        or emoteType == "WALKS"
end

local EMOTE_ICONS = {
    [EmoteType.DANCES] = "💃",
    [EmoteType.ANIMAL_EMOTES] = "🐶",
    [EmoteType.PROP_EMOTES] = "📦",
    [EmoteType.EMOTES] = "🎭",
    [EmoteType.SHARED] = "👥",
    [EmoteType.EXPRESSIONS] = "😊",
    [EmoteType.WALKS] = "🚶",
}

-- Build categories from config
local function buildCategories()
    local categories = {}
    
    for categoryName, _ in pairs(Config.CustomCategories) do
        table.insert(categories, {
            id = categoryName,
            name = categoryName
        })
    end
    
    if Config.ExpressionsEnabled then
        table.insert(categories, {
            id = "expressions",
            name = Translate('moods')
        })
    end
    
    if Config.WalkingStylesEnabled then
        table.insert(categories, {
            id = "walks",
            name = Translate('walkingstyles')
        })
    end
    
    return categories
end

-- Build emotes list from EmoteData
local function buildEmotes()
    local emotes = {}
    
    if not CONVERTED then return emotes end
    
    local favorites = GetFavoriteEmotes()
    
    -- Add from custom categories
    for categoryName, emoteTypeMap in pairs(Config.CustomCategories) do
        for emoteType, emoteNames in pairs(emoteTypeMap) do
            if #emoteNames == 0 then
                -- Add all of this type
                if emoteType == EmoteType.SHARED and SharedEmoteData then
                    for name, data in pairs(SharedEmoteData) do
                        table.insert(emotes, {
                            id = name,
                            name = data.label or name,
                            description = "/nearby " .. name,
                            category = categoryName,
                            type = emoteType,
                            icon = EMOTE_ICONS[emoteType] or "🎭",
                            isFavorite = favorites[name] ~= nil
                        })
                    end
                elseif EmoteData then
                    for name, data in pairs(EmoteData) do
                        if data.emoteType == emoteType then
                            table.insert(emotes, {
                                id = name,
                                name = data.label or name,
                                description = "/e " .. name,
                                category = categoryName,
                                type = emoteType,
                                icon = EMOTE_ICONS[emoteType] or "🎭",
                                isFavorite = favorites[name] ~= nil
                            })
                        end
                    end
                end
            end
        end
    end
    
    -- Add regular emotes
    if EmoteData then
        for name, data in pairs(EmoteData) do
            if data.emoteType == EmoteType.EMOTES then
                table.insert(emotes, {
                    id = name,
                    name = data.label or name,
                    description = "/e " .. name,
                    category = "emotes",
                    type = data.emoteType,
                    icon = "🎭",
                    isFavorite = favorites[name] ~= nil
                })
            end
        end
    end
    
    -- Add expressions
    if Config.ExpressionsEnabled and ExpressionData then
        for name, data in pairs(ExpressionData) do
            table.insert(emotes, {
                id = name,
                name = data.label or name,
                description = "",
                category = "expressions",
                type = "EXPRESSIONS",
                icon = "😊",
                isFavorite = favorites[name] ~= nil
            })
        end
    end
    
    -- Add walks
    if Config.WalkingStylesEnabled and WalkData then
        for name, data in pairs(WalkData) do
            table.insert(emotes, {
                id = name,
                name = data.label or name,
                description = "/walk " .. name,
                category = "walks",
                type = "WALKS",
                icon = "🚶",
                isFavorite = favorites[name] ~= nil
            })
        end
    end
    
    return emotes
end

-- Open NUI menu
function OpenEmoteMenuNUI()
    if isMenuOpen then return end
    if not CONVERTED then return end
    
    isMenuOpen = true
    SetNuiFocus(true, true)
    
    SendNUIMessage({
        action = 'openMenu',
        categories = buildCategories(),
        emotes = buildEmotes()
    })
end

-- Override OpenEmoteMenu to use NUI
function OpenEmoteMenu()
    OpenEmoteMenuNUI()
end

-- Close menu
function CloseEmoteMenuNUI()
    if not isMenuOpen then return end
    
    isMenuOpen = false
    SetNuiFocus(false, false)
    
    -- Close preview ped
    if Config.PreviewPed and hasClonedPed() then
        ClosePedMenu()
        LastEmote = {}
    end
    
    SendNUIMessage({
        action = 'closeMenu'
    })
end

-- NUI Callbacks
RegisterNUICallback('closeMenu', function(data, cb)
    CloseEmoteMenuNUI()
    cb('ok')
end)

RegisterNUICallback('selectEmote', function(data, cb)
    cb('ok')
    
    local emoteName = data.emoteName
    local emoteType = data.emoteType
    
    if not emoteName then return end
    
    CloseEmoteMenuNUI()
    
    CreateThread(function()
        Wait(50)
        
        if emoteType == "EXPRESSIONS" then
            SetPlayerPedExpression(emoteName, true)
        elseif emoteType == "WALKS" then
            WalkMenuStart(emoteName, false)
        elseif emoteType == EmoteType.SHARED then
            local target, distance = GetClosestPlayer()
            if (distance ~= -1 and distance < 3) then
                TriggerServerEvent("rpemotes:server:requestEmote", GetPlayerServerId(target), emoteName)
                -- Notification removed
            else
                -- Notification removed
            end
        else
            OnEmotePlay(emoteName)
        end
    end)
end)

-- ESC handler
CreateThread(function()
    while true do
        Wait(0)
        if isMenuOpen then
            DisableControlAction(0, 322, true)
            DisableControlAction(0, 200, true)
        end
    end
end)

RegisterNUICallback('toggleFavorite', function(data, cb)
    local id = data.id
    local emoteData = {
        name = id,
        label = data.name,
        emoteType = data.type,
        category = data.category
    }
    
    ToggleFavoriteEmote(id, emoteData)
    cb('ok')
end)

-- Preview emote on hover (in tooltip)
RegisterNUICallback('previewEmote', function(data, cb)
    local emoteName = data.emoteName
    local emoteType = data.emoteType
    
    if not emoteName or not Config.PreviewPed then 
        cb('ok')
        return 
    end
    
    -- Check if we're already showing this exact emote
    if LastEmote.name == emoteName and hasClonedPed() then
        cb('ok')
        return
    end
    
    -- Check if this emote type is previewable
    if not isEmoteTypePreviewable(emoteType) then
        cb('ok')
        return
    end
    
    -- Clear previous preview
    if hasClonedPed() then
        ClearPedTaskPreview()
    end
    
    -- Update LastEmote
    LastEmote = {
        name = emoteName,
        emoteType = emoteType
    }
    
    -- Show preview in tooltip (smaller, positioned differently)
    if hasClonedPed() then
        EmoteMenuStartClone(emoteName, emoteType)
    else
        -- Always use zoom for tooltip preview (smaller ped)
        currentZoomState = true
        ShowPedMenuTooltip()
        WaitForClonedPedThenPlayLastAnim()
    end
    
    cb('ok')
end)

-- Custom ShowPedMenu for tooltip preview (smaller ped, original position)
function ShowPedMenuTooltip()
    if not Config.PreviewPed then return end

    if not ShowPed then
        CreateThread(function()
            local playerPed = PlayerPedId()
            local coords = GetEntityCoords(playerPed) - vector3(0.0, 0.0, 10.0)
            ClonedPed = CreatePed(26, GetEntityModel(playerPed), coords.x, coords.y, coords.z, 0, false, false)
            ClonePedToTarget(playerPed, ClonedPed)

            SetEntityInvincible(ClonedPed, true)
            SetEntityLocallyVisible(ClonedPed)
            NetworkSetEntityInvisibleToNetwork(ClonedPed, true)
            SetEntityCanBeDamaged(ClonedPed, false)
            SetBlockingOfNonTemporaryEvents(ClonedPed, true)
            SetEntityAlpha(ClonedPed, 254, false)
            SetEntityCollision(ClonedPed, false, false)
            SetPedCanBeTargetted(ClonedPed, false)

            ShowPed = true

            local positionBuffer = {}
            local bufferSize = 5

            while ShowPed do
                -- Original position, just smaller
                local screencoordsX = 0.65135417461395
                local screencoordsY = 0.77

                if Config.MenuPosition == "left" then
                    screencoordsX = 1.0 - screencoordsX
                end

                local world, normal = GetWorldCoordFromScreenCoord(screencoordsX, screencoordsY)
                -- Increased depth to make ped smaller (original was 3.5, now 5.5)
                local depth = 5.5
                local target = world + normal * depth
                local camRot = GetGameplayCamRot(2)

                positionBuffer[#positionBuffer + 1] = target
                if #positionBuffer > bufferSize then
                    table.remove(positionBuffer, 1)
                end

                local averagedTarget = vector3(0, 0, 0)
                for _, position in ipairs(positionBuffer) do
                    averagedTarget = averagedTarget + position
                end
                averagedTarget = averagedTarget / #positionBuffer

                local zOffset = IsPedHuman(ClonedPed) and 0.0 or 0.5
                SetEntityCoords(ClonedPed, averagedTarget.x, averagedTarget.y, averagedTarget.z + zOffset, false, false, false, false)
                local heading_offset = Config.MenuPosition == "left" and 170.0 or 190.0
                SetEntityHeading(ClonedPed, camRot.z + heading_offset)
                SetEntityRotation(ClonedPed, camRot.x * (-1), 0.0, camRot.z + 170.0, 2, false)
                ForcePedMotionState(ClonedPed, `MotionState_None`, false, 1, true)

                Wait(4)
            end

            DeleteEntity(ClonedPed)
            ClonedPed = nil
        end)
    end
end

-- Clear preview
RegisterNUICallback('clearPreview', function(data, cb)
    if Config.PreviewPed and hasClonedPed() then
        ClearPedTaskPreview()
        LastEmote = {}
    end
    cb('ok')
end)
