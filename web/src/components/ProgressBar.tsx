
interface Props {
	progressbar: number
}

export function ProgressBar({ progressbar }: Props) {
	return (
		<div className='h-3 rounded-xl bg-zinc-700 w-full mt-4'>
			<div
				className='h-3 rounded-xl bg-violet-600 transition-all'
				role="progressbar"
				aria-label='Progresso de habitos completados'
				aria-valuenow={progressbar}
				style={{width: `${progressbar}%`}}
			/>
		</div>
	)
}
