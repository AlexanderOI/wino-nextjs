"use client"

import { io, Socket } from "socket.io-client"
import { BACKEND_URL } from "@/constants/routes"

class SocketService {
  private static instance: SocketService
  private socket: Socket | null = null

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  public connect(token?: string): Socket {
    if (!this.socket) {
      this.socket = io(BACKEND_URL + "/notifications", {
        auth: token ? { token } : undefined,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      this.socket.on("connect", () => {
        console.log("Socket conectado")
      })

      this.socket.on("disconnect", () => {
        console.log("Socket desconectado")
      })

      this.socket.on("connect_error", (error) => {
        console.error("Error de conexión:", error)
      })
    }

    return this.socket
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  public getSocket(): Socket | null {
    return this.socket
  }
}

export const socketService = SocketService.getInstance()
