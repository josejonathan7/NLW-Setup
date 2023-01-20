import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox'
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";


const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado']

export function NewHabitForm() {
	const [ title, setTitle ] = useState('')
	const [ weekDays, setWeekDays ] = useState<number[]>([])

	async function createNewHabit(event: FormEvent) {
		event.preventDefault()

		if(!title || weekDays.length === 0) {
			return
		}

		await api.post("/habits", {title, weekDays})

		setTitle('')
		setWeekDays([])

		alert("Hábito criado com sucesso")
	}

	function handleToggleWeekDay(weekDay: number) {
		if(weekDays.includes(weekDay)){
			const weekDaysWithRemoveOne = weekDays.filter(day => day !== weekDay)

			setWeekDays(weekDaysWithRemoveOne)
		} else {
			const weeDaysWithAddedOne = [...weekDays, weekDay]

			setWeekDays(weeDaysWithAddedOne)
		}
	}

	return(
		<form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
			<label htmlFor="title" className="font-semibold leading-tight">
				Qual seu comprometimento?
			</label>
			<input
				type="text"
				id="title"
				placeholder="Ex.: Exercicios, dormir bem, etc..."
				autoFocus
				className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
				onChange={event => setTitle(event.target.value)}
				value={title}
			/>

			<label htmlFor="" className="font-semibold leading-tight mt-4">
				Qual a recorrência?
			</label>

			<div className='mt-3 flex flex-col gap-2'>

				{
					availableWeekDays.map((weekDay, index) => (
						<Checkbox.Root
							className='flex items-center gap-3 group'
							key={weekDay}
							checked={weekDays.includes(index)}
							onCheckedChange={() => handleToggleWeekDay(index)}
						>

						<div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
							<Checkbox.Indicator>
								<Check size={20} className="text-white" />
							</Checkbox.Indicator>
						</div>

						<span className='text-white leading-tight'>
							{weekDay}
						</span>
					</Checkbox.Root>
					))
				}

			</div>


			<button type="submit" className="mt-6 rounded-lg p-4 flex gap-3 items-center font-semibold bg-green-600 justify-center hover:bg-green-500">
				<Check size={20} weight="bold" />
				Confirmar
			</button>
		</form>
	)
}
