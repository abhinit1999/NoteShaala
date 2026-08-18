"use client"

import { useState } from "react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"

export function SubscribeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setMessage("")
    
    const formData = new FormData(e.currentTarget)
    const result = await subscribeToNewsletter(formData)
    
    if (result.error) {
      setStatus("error")
      setMessage(result.error)
    } else if (result.success) {
      setStatus("success")
      setMessage(result.message)
    }
  }

  return (
    <div className="mt-6 max-w-md w-full">
      <form onSubmit={handleSubmit} className="flex w-full">
        <input 
          name="email"
          type="email" 
          required
          disabled={status === "loading" || status === "success"}
          className="bg-surface/50 border border-border text-white px-4 py-3 rounded-l-lg focus:outline-none focus:border-primary flex-1 min-w-0 disabled:opacity-50" 
          placeholder="Enter your email address" 
        />
        <button 
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-r-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
        >
          {status === "loading" ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : status === "success" ? (
            "Subscribed!"
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
      
      {message && (
        <p className={`mt-3 text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  )
}
