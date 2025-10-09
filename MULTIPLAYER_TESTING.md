# Local Multiplayer Testing Guide

This guide explains how to test the multiplayer battle functionality locally with multiple players.

## Quick Start

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open multiple browser tabs/windows with different player names:
   
   **Player 1 (Alice):** 
   ```
   http://localhost:5173/battle?playerName=Alice
   ```
   
   **Player 2 (Bob):**
   ```
   http://localhost:5173/battle?playerName=Bob
   ```
   
   **Player 3 (Charlie):**
   ```
   http://localhost:5173/battle?playerName=Charlie
   ```

## URL Parameters

### `playerName`
Sets the display name for the player.
```
?playerName=Alice
```

### `playerId` 
Sets a custom unique ID for the player (optional).
```
?playerId=custom_alice_id&playerName=Alice
```

## Testing Scenarios

### Basic Multiplayer Test
1. Open 2-3 tabs with different `playerName` values
2. All players should appear in the left sidebar
3. Start a battle (admin controls may appear in one tab)
4. Run code tests in different tabs
5. Observe live progress updates across all tabs

### Test Progress Updates
1. Open multiple tabs as different players
2. In one tab, run some tests (partial completion)
3. Check other tabs - progress bars should update in real-time
4. Complete all tests in one tab
5. Other tabs should show the completion status immediately

### Admin Testing
- The first player to join often gets admin privileges
- Admin can start/complete battles
- Test admin controls from different tabs

## Debug Features

When using URL parameters, a debug panel appears at the top showing:
- Current player name and ID
- Button to log test URLs to console
- Instructions for multi-player testing

## Browser Developer Tools

Open the browser console to see:
- WebSocket connection logs
- Player list updates
- Test result messages
- Generated test URLs (when clicking "Log Test URLs")

## Tips

1. **Use different browser windows** instead of tabs to better simulate different users
2. **Test on different browsers** (Chrome, Firefox, Safari) to ensure compatibility
3. **Use private/incognito windows** to avoid session conflicts
4. **Check the Network tab** in dev tools to monitor WebSocket messages
5. **Clear localStorage** if you encounter issues with player persistence

## Common Issues

### Players not appearing
- Check WebSocket connection in network tab
- Ensure all tabs are using the same battle room
- Refresh tabs if needed

### Test results not syncing
- Verify WebSocket messages are being sent/received
- Check console for any JavaScript errors
- Make sure all players are in the same battle session

### Admin controls missing
- Try refreshing the first tab that joined
- Check if another tab has admin controls
- Admin status may rotate between players