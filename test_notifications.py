#!/usr/bin/env python3
"""
Test script for WebSocket notifications
"""

import asyncio
import websockets
import json
import time

async def test_websocket():
    """Test WebSocket connection and notifications"""
    uri = "ws://localhost:8000/ws/notifications"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to WebSocket server")
            
            # Send a ping message to keep connection alive
            await websocket.send("ping")
            print("📤 Sent ping message")
            
            # Wait for messages
            print("👂 Listening for notifications...")
            
            # Keep connection alive for 30 seconds
            start_time = time.time()
            while time.time() - start_time < 30:
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                    data = json.loads(message)
                    print(f"📨 Received notification: {data}")
                except asyncio.TimeoutError:
                    # No message received, continue listening
                    pass
                except Exception as e:
                    print(f"❌ Error receiving message: {e}")
                    break
            
            print("⏰ Test completed")
            
    except Exception as e:
        print(f"❌ Failed to connect to WebSocket: {e}")

if __name__ == "__main__":
    print("🚀 Starting WebSocket notification test...")
    asyncio.run(test_websocket()) 