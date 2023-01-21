import * as Checkbox from '@radix-ui/react-checkbox'
import dayjs from 'dayjs'
import { Check } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface Props {
	date: Date;
	onCompletedChange: (completed: number) => void;
}

interface HabitsInfo {
	possibleHabits: Array<{
		id: string;
		title: string;
		created_at: string;
	}>,
	completedHabits: string[]
}

export function HabitsList({ date, onCompletedChange }: Props) {
	const [ habitsInfo, setHabitsInfo ] = useState<HabitsInfo>()

	useEffect(() => {
		async function getHabitDay() {
			const { data } = await api.get('day', {
				params: {
					date: date.toISOString()
				}
			})

			setHabitsInfo(data)
		}

		getHabitDay()
	},[])


	const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

	async function handleToggleHabit(habitId: string) {
		await api.patch(`/habits/${habitId}/toggle`)

		const isHabitAlredyCompleted = habitsInfo!.completedHabits.includes(habitId)
		let completedHabits: string[]

		if(isHabitAlredyCompleted) {
			completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)

			setHabitsInfo({
				completedHabits,
				possibleHabits: habitsInfo!.possibleHabits
			})
		} else {
			completedHabits = [...habitsInfo!.completedHabits, habitId]

			setHabitsInfo({
				completedHabits,
				possibleHabits: habitsInfo!.possibleHabits
			})
		}

		onCompletedChange(completedHabits.length)
	}

	return(
		<div className='mt-6 flex flex-col gap-4'>

			{
				habitsInfo?.possibleHabits.map(habits => (
					<Checkbox.Root
						key={habits.id}
						className='flex items-center gap-3 group'
						onCheckedChange={() => handleToggleHabit(habits.id)}
						checked={habitsInfo.completedHabits.includes(habits.id)}
						disabled={isDateInPast}
					>

						<div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors'>
							<Checkbox.Indicator>
								<Check size={20} className="text-white" />
							</Checkbox.Indicator>
						</div>

						<span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
							{habits.title}
						</span>
					</Checkbox.Root>
				))
			}


		</div>
	)
}
