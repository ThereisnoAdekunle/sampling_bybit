"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, AlertTriangle, Search } from "lucide-react"

export default function DebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryResults, setDeliveryResults] = useState<any>(null)

  const testSelfDelivery = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType: "self" }),
      })
      const data = await response.json()
      setDeliveryResults(data)
    } catch (error) {
      console.error("Self delivery test failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const testExternalDelivery = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType: "external" }),
      })
      const data = await response.json()
      setDeliveryResults(data)
    } catch (error) {
      console.error("External delivery test failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">📧 Email Delivery Debug</h1>
          <p className="text-muted-foreground">Debug why emails aren't reaching the inbox</p>
        </div>

        {/* Issue Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Issue:</strong> Console shows "email sent successfully" but emails not received in inbox.
            <br />
            <strong>Common causes:</strong> Spam folder, Gmail rate limiting, wrong recipient emails, or Gmail security
            settings.
          </AlertDescription>
        </Alert>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Self-Test
              </CardTitle>
              <CardDescription>Send email to sender's own Gmail account (most likely to work)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testSelfDelivery} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Test Self-Delivery
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                External Test
              </CardTitle>
              <CardDescription>Send emails to recipient addresses to test delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testExternalDelivery} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Test External Delivery
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {deliveryResults && (
          <Card>
            <CardHeader>
              <CardTitle>📊 Delivery Test Results</CardTitle>
              <CardDescription>Test Type: {deliveryResults.testType}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveryResults.results?.map((result: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{result.recipient}</span>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "SENT" : "FAILED"}
                    </Badge>
                  </div>

                  {result.success ? (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Message ID:</strong> {result.messageId}
                      </p>
                      <p>
                        <strong>Accepted:</strong> {result.accepted?.join(", ") || "N/A"}
                      </p>
                      {result.rejected && result.rejected.length > 0 && (
                        <p className="text-red-600">
                          <strong>Rejected:</strong> {result.rejected.join(", ")}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">{result.error}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Check Spam/Junk Folder</h4>
              <p className="text-sm text-muted-foreground">
                Most common issue - emails are being delivered but filtered to spam
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">2. Check Gmail Tabs</h4>
              <p className="text-sm text-muted-foreground">
                Gmail might sort emails into Promotions, Social, or Updates tabs
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">3. Check Gmail Sent Folder</h4>
              <p className="text-sm text-muted-foreground">
                Verify emails appear in westkhalifahninety7@gmail.com sent folder
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">4. Gmail Rate Limiting</h4>
              <p className="text-sm text-muted-foreground">
                Gmail limits: 500 emails/day, 100 emails/hour. Multiple emails to same domain might be limited.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">5. Try Different Email Providers</h4>
              <p className="text-sm text-muted-foreground">
                Test with Yahoo, Outlook, or other providers to isolate Gmail-specific issues
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
