"use client"

import { useEffect, useRef, useCallback } from "react"
import { Socket } from "socket.io-client"
import { useSession } from "next-auth/react"
import { socketService } from "@/lib/socket"

export const useSocket = () => {
  const { data: session } = useSession()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (session?.backendTokens?.accessToken) {
      socketRef.current = socketService.connect(session.backendTokens.accessToken)
    }

    return () => {
      socketService.disconnect()
    }
  }, [session?.backendTokens?.accessToken])

  const emit = useCallback(<T>(event: string, data?: T) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }, [])

  const on = useCallback(<T>(event: string, callback: (data: T) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback)
      }
    }
  }, [])

  const off = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }, [])

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
  }
}
