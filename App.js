import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cardapio from './src/components/cardapio';
import Carrinho from './src/components/carrinho';
import Checkout from './src/components/checkout';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="cardapio"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="cardapio" component={Cardapio} />
                <Stack.Screen name="carrinho" component={Carrinho} />
                <Stack.Screen name="checkout" component={Checkout} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}