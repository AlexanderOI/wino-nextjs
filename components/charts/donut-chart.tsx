"use client"
import { Label, Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import { cn } from "@/lib/utils"

const chartConfig = {
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

interface Props {
  data: {
    name: string
    value: number
    fill?: string
  }[]
  centerText: string
  bottomText: string
  className?: string
}

export function DonutChart({ data, centerText, bottomText, className }: Props) {
  return (
    <ChartContainer
      className={cn("mx-auto aspect-square max-h-[250px]", className)}
      config={chartConfig}
    >
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {centerText}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {bottomText}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
