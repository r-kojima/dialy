import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "日記の日付"
export const size = {
	width: 1200,
	height: 630,
}
export const contentType = "image/png"

interface OGImageProps {
	params: Promise<{ year: string; month: string; day: string }>
}

export default async function Image({ params }: OGImageProps) {
	const { year, month, day } = await params

	// 日付を YYYY/MM/DD 形式にフォーマット
	const formattedDate = `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`

	return new ImageResponse(
		<div
			style={{
				fontSize: 128,
				background: "linear-gradient(to bottom, #f9fafb, #e5e7eb)",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: "sans-serif",
				fontWeight: 700,
				color: "#1f2937",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{formattedDate}
			</div>
		</div>,
		{
			...size,
		},
	)
}
