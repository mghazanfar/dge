import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Application Submission API Started ===")

    // Parse request body
    let formData
    try {
      formData = await request.json()
      console.log("Form data received successfully")
      console.log("Personal info name:", formData?.personalInfo?.name)
      console.log("Family info status:", formData?.familyFinancialInfo?.maritalStatus)
      console.log("Situation descriptions count:", Object.keys(formData?.situationDescriptions || {}).length)
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
        },
        { status: 400 },
      )
    }

    // Validate required data
    if (!formData || !formData.personalInfo || !formData.familyFinancialInfo || !formData.situationDescriptions) {
      console.error("Missing required form sections")
      return NextResponse.json(
        {
          success: false,
          error: "Missing required form data",
        },
        { status: 400 },
      )
    }

    // Validate personal info
    const { personalInfo } = formData
    if (!personalInfo.name || !personalInfo.email || !personalInfo.nationalId) {
      console.error("Missing required personal information")
      return NextResponse.json(
        {
          success: false,
          error: "Missing required personal information",
        },
        { status: 400 },
      )
    }

    // Simulate API processing time
    console.log("Processing application...")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a mock application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    console.log("=== Application Submission Success ===")
    console.log("Generated application ID:", applicationId)

    // Here you would typically save to a database
    console.log("Application data to be saved:", {
      applicationId,
      personalInfo: {
        name: personalInfo.name,
        email: personalInfo.email,
        // Log other fields without sensitive data
      },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      applicationId,
      message: "Application submitted successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("=== Application Submission Error ===")
    console.error("Error details:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
