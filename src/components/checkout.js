import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { cores } from '../temas.js';

const somenteNumeros = (valor) => valor.replace(/\D/g, '');
const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

export default function Checkout({ navigation, route }) {
    const total = route.params?.total || 0;
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [referencia, setReferencia] = useState('');
    const [pagamento, setPagamento] = useState('Cartão');
    const [precisaTroco, setPrecisaTroco] = useState(false);
    const [trocoPara, setTrocoPara] = useState('');

    const finalizarPedido = () => {
        const telefoneNumerico = somenteNumeros(telefone);
        const cepNumerico = somenteNumeros(cep);
        const valorTroco = Number(trocoPara.replace(',', '.'));

        if (!nome.trim() || nome.trim().length < 3) {
            Alert.alert('Dados incompletos', 'Informe seu nome completo.');
            return;
        }
        if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11) {
            Alert.alert('Dados incompletos', 'Informe um telefone válido.');
            return;
        }
        if (cepNumerico.length !== 8) {
            Alert.alert('Dados incompletos', 'Informe um CEP válido com 8 números.');
            return;
        }
        if (!endereco.trim() || !numero.trim() || !referencia.trim()) {
            Alert.alert('Dados incompletos', 'Preencha endereço, número e referência.');
            return;
        }
        if (
            pagamento === 'Dinheiro' &&
            precisaTroco &&
            (!trocoPara || valorTroco < total)
        ) {
            Alert.alert('Troco inválido', 'Informe um valor de troco maior ou igual ao total do pedido.');
            return;
        }

        Alert.alert('Pedido confirmado', 'Seu pedido foi enviado para preparo.', [
            { text: 'OK', onPress: () => navigation.navigate('cardapio') }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.titulo}>← Checkout</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.secao}>Dados de entrega</Text>

                <Text style={styles.secao}>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Maria Silva"
                    value={nome}
                    onChangeText={setNome}
                />
                <Text style={styles.secao}>Telefone</Text>
                <TextInput
                    style={styles.input}
                    placeholder="(19) 9____"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                />
                <Text style={styles.secao}>CEP</Text>
                <TextInput
                    style={styles.input}
                    placeholder="13012456"
                    value={cep}
                    onChangeText={setCep}
                    keyboardType="numeric"
                />
                <Text style={styles.secao}>Endereço</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Endereço"
                    value={endereco}
                    onChangeText={setEndereco}
                />

                <View style={styles.linha}>
                    <Text style={styles.secao}>Número</Text>
                    <TextInput
                        style={[styles.input, styles.inputMenor]}
                        placeholder="Número"
                        value={numero}
                        onChangeText={setNumero}
                        keyboardType="numeric"
                    />
                    <Text style={styles.secao}>Complemento</Text>
                    <TextInput
                        style={[styles.input, styles.inputMaior]}
                        placeholder="Complemento (opcional)"
                        value={complemento}
                        onChangeText={setComplemento}
                    />
                </View>
                <Text style={styles.secao}>Referência</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Referência"
                    value={referencia}
                    onChangeText={setReferencia}
                />

                <Text style={styles.secao}>Pagamento</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={pagamento}
                        onValueChange={setPagamento}
                        dropdownIconColor="#3D5AFE"
                        style={styles.picker}
                    >
                        <Picker.Item label="Cartão" value="Cartão" />
                        <Picker.Item label="Pix" value="Pix" />
                        <Picker.Item label="Dinheiro" value="Dinheiro" />
                    </Picker>
                </View>

                {pagamento === 'Dinheiro' && (
                    <View style={styles.trocoContainer}>
                        <View style={styles.switchLinha}>
                            <Text style={styles.label}>Preciso de troco</Text>

                            <Switch value={precisaTroco} onValueChange={setPrecisaTroco}
                                trackColor={{
                                    false: '#b3a9a9',
                                    true: cores.sucesso,
                                }}
                                thumbColor={precisaTroco ? '#FFFFFF' : '#F4F4F4'}
                                ios_backgroundColor="#D5D5D5" />
                        </View>
                        {precisaTroco && (
                            <TextInput
                                style={styles.input}
                                placeholder="Troco para"
                                value={trocoPara}
                                onChangeText={setTrocoPara}
                                keyboardType="numeric"
                            />
                        )}
                    </View>
                )}

                <View style={styles.totalLinha}>
                    <Text style={styles.totalLabel}>Total do pedido</Text>
                    <Text style={styles.total}>{formatarMoeda(total)}</Text>
                </View>

                <TouchableOpacity style={styles.botao} onPress={finalizarPedido}>
                    <Text style={styles.botaoTexto}>Finalizar pedido</Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.foot}>T3 - Checkout</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20
    },
    header: {
        backgroundColor: cores.primaria,
        borderRadius: 20
    },
    titulo: {
        margin: 10,
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: cores.backgroundClaro
    },
    scrollContainer: {
        paddingVertical: 20,
        paddingBottom: 30
    },
    secao: {
        color: cores.texto,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#d5d5d5',
        borderRadius: 10,
        borderWidth: 1,
        color: cores.texto,
        fontSize: 15,
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 12
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderColor: '#d5d5d5',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 12,
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#202A44',
        borderRadius: 10,
    },
    trocoContainer: {
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        padding: 12
    },
    switchLinha: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    label: {
        color: cores.texto,
        fontSize: 15,
        fontWeight: '600'
    },
    totalLinha: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16
    },
    totalLabel: {
        color: cores.texto,
        fontSize: 17,
        fontWeight: 'bold'
    },
    total: {
        color: cores.sucesso,
        fontSize: 19,
        fontWeight: 'bold'
    },
    botao: {
        alignItems: 'center',
        backgroundColor: cores.primaria,
        borderRadius: 12,
        paddingVertical: 15
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    foot: {
        color: cores.primaria,
        fontWeight: 'bold'
    },
});
