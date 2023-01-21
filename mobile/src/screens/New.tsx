import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";


const availableWeekDays = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sabado']

export function New() {
    const [ weekDays, setWeekDays] = useState<number[]>([])
    const [ title, setTitle ] = useState('')

    function handleToggleWeekDay(weekDayIndex: number) {
        if(weekDays.includes(weekDayIndex)) {
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
        } else {
            setWeekDays((prevState => [...prevState, weekDayIndex]))
        }
    }

    async function handleCreateNewHabit() {
        try {
            if(!title.trim() || weekDays.length === 0) {
                return Alert.alert('Novo hávbito', 'informa o nome do hábito e escolha a recorrência')
            }

            await api.post("/habits", {title, weekDays})

            setTitle("")
            setWeekDays([])

            Alert.alert('Novo hávbito', 'Habito criado com sucesso')
        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'não foi possivel criar o habito')
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar Hábito
                </Text>


                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento?
                </Text>

                <TextInput 
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="Exerccios, dormir bem, etc..."
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={text => setTitle(text)}
                    value={title}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência?
                </Text>

                {
                    availableWeekDays.map((weekDay, index) => (
                        <CheckBox 
                            key={weekDay}
                            title={weekDay}
                            checked={weekDays.includes(index)}
                            onPress={() => handleToggleWeekDay(index)}
                        />
                    ))
                }


            <TouchableOpacity 
                className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                activeOpacity={0.7}    
                onPress={handleCreateNewHabit}
            >
                <Feather 
                    name="check"
                    size={20}
                    color={colors.white}
                />

                <Text 
                    className="font-semibold text-base text-white ml-2"
                >
                    Confirmar
                </Text>
            </TouchableOpacity>
            </ScrollView>
        </View>
    )
}