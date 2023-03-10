import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generateDays";
import { HabitDay } from "./HabitDay"


const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatesFromYearBeginning()

const minimumSumaryDateSize = 18*7
const amountOfDaysFill = minimumSumaryDateSize - summaryDates.length


type Summary = Array<{
	id: string;
	date: string;
	amount: number;
	completed: number
}>

export function SummaryTable () {
	const [ summary, setSummary ] = useState<Summary>([])

	useEffect(() => {
		async function requestServer () {
			const { data } = await api.get("/summary")
			setSummary(data)
		}

		requestServer()
	}, [])

	return (
		<div className="w-full flex">

			<div className="grid grid-rows-7 grid-flow-row gap-3">

				{weekDays.map((weekDay, index) => {
					return (
						<div key={index} className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold">
							{weekDay}
						</div>
					)
				})}
			</div>

			<div className="grid grid-rows-7 grid-flow-col gap-3">
				{
					summaryDates.length > 0 && summaryDates.map((date) => {
						const dayInSummary = summary.find(day => {
							return dayjs(date).isSame(day.date, 'day')
						})

						return <HabitDay
							key={date.toString()}
							amount={dayInSummary?.amount}
							defaultCompleted={dayInSummary?.completed}
							date={date}
						/>
					})
				}

				{
					amountOfDaysFill > 0 && Array.from({ length: amountOfDaysFill }).map((_, index) => {
						return (
							<div key={index} className="h-10 w-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"></div>
						)
					})
				}
			</div>

		</div>
	)
}
