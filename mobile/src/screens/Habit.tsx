import { useRoute } from "@react-navigation/native";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

interface Params {
    date: string
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: Array<{
        id: string;
        title: string;
        created_at: string;
    }>
}

export function Habit() {
    const route = useRoute()    
    const [loading, setLoading] = useState(true)
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
    const { date } = route.params as Params

    const parsedDate = dayjs(date)
    const dayOfWeek = parsedDate.format('dddd')
    const dayAnMonth = parsedDate.format('DD/MM')
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date())

    const habitProgress = dayInfo?.possibleHabits.length 
        ? generateProgressPercentage(dayInfo.possibleHabits.length, dayInfo.completedHabits.length) 
        : 0

    async function fetch() {
        try {
            setLoading(true)

            const { data } = await api.get('day' , {params: { date }})
            setDayInfo(data)

        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "não foi possivel buscar o habito")
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`)    
        
            let completedHabits: string[]

            if(dayInfo?.completedHabits.includes(habitId)) {
                completedHabits = dayInfo.completedHabits!.filter(id => id !== habitId)

                setDayInfo({
                    possibleHabits: dayInfo.possibleHabits,
                    completedHabits
                })
            } else {
                completedHabits = [...dayInfo!.completedHabits, habitId]

                setDayInfo({
                    possibleHabits: dayInfo!.possibleHabits,
                    completedHabits
                })
            }

        } catch (error) {
            console.log(error)
            Alert.alert("ops", "não foi possivel atualizar o status do habito")
        }
    }

    useEffect(() => {
        fetch()
    }, [])

    if(loading) {
        return <Loading />
    }
    
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAnMonth}
                </Text>

                <ProgressBar progress={habitProgress} />

                <View className={clsx("mt-6", {
                    "opacity-50": isDateInPast
                })}>

                    {
                        
                        dayInfo?.possibleHabits.length ? 
                            dayInfo?.possibleHabits.map(habit => (
                                <CheckBox 
                                    key={habit.id}
                                    title={habit.title}
                                    checked={dayInfo.completedHabits.includes(habit.id)}
                                    disabled={isDateInPast}
                                    onPress={() => handleToggleHabit(habit.id)}
                                />
                            ))
                        :
                            <HabitsEmpty />
                    }

               
                </View>
            </ScrollView>
        </View>
    )
}