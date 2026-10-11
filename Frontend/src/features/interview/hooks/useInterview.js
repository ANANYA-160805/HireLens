import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resume: resumeFile
            })
            setReport(response.interviewReport)
            return response.interviewReport
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    const getReportById = useCallback(async (id) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(id)
            setReport(response.interviewReport)
            return response.interviewReport
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    const getReports = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReports])

    const getResumePdf = useCallback(async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", "AI_Generated_Resume.pdf")
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.setTimeout(() => window.URL.revokeObjectURL(url), 1000)
        } catch (error) {
            const status = error.response?.status
            const responseData = error.response?.data
            let message = ""

            if (responseData instanceof Blob) {
                const responseText = await responseData.text()
                try {
                    message = JSON.parse(responseText).message || ""
                } catch {
                    message = responseText
                }
            } else if (typeof responseData?.message === "string") {
                message = responseData.message
            }

            if (status === 401) {
                throw new Error("Your session has expired. Please sign in and try again.", { cause: error })
            }
            if (status === 403) {
                throw new Error("You are not allowed to download this resume.", { cause: error })
            }
            if (status === 429 || status === 503) {
                throw new Error(message || "Resume generation is temporarily unavailable. Please try again shortly.", { cause: error })
            }
            if (!error.response) {
                throw new Error("Could not reach the server. Check your connection and try again.", { cause: error })
            }
            throw new Error(message || "Could not generate the resume PDF. Please try again.", { cause: error })
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    useEffect(() => {
        const load = interviewId ? getReportById(interviewId) : getReports()
        load.catch((error) => {
            console.error("Failed to load interview data:", error)
        })
    }, [interviewId, getReportById, getReports])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}