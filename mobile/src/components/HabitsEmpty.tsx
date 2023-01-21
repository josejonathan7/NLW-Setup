import { useNavigation } from '@react-navigation/native'
import { Text } from 'react-native'

export function HabitsEmpty() {
    const { navigate } = useNavigation()

    return(
        <Text className='text-zinc-400 text-base'>
            Sem hábitos nesse dia {' '}

            <Text
                onPress={() => navigate('new')}
                className="text-violet-400 text-base underline active:text-violet-500"
            >
                comece cadastrando um
            </Text>
        </Text>
    )
}