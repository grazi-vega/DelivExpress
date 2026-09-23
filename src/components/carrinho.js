import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { cores } from '../temas.js';

const formatarPreco = (preco) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(preco);

export default function Carrinho({ navigation, route }) {
    const [itens, setItens] = useState(route.params?.itensdocarrinho || []);
    const [cupom, setCupom] = useState('');
    const [desconto, setDesconto] = useState(false);
    const [cupomErro, setCupomErro] = useState('');

    const voltarpCardapio = () => {
        navigation.navigate('cardapio', {
            itensAtualizados: itens
        });
    };

    const ativarDesc = () => {
        if (cupom === 'ALUNO10') {
            setDesconto(true);
            setCupomErro('');
        } else {
            setDesconto(false);
            setCupomErro('Cupom Inválido');
        }
    };

    const alterarqtd = (id, novaQtd) => {

        setItens((itensAtuais) => {

            if (novaQtd <= 0) {
                return itensAtuais.filter(
                    (item) => item.id !== id
                );
            }

            return itensAtuais.map((item) => {

                if (item.id === id) {
                    return {
                        ...item,
                        qtd: novaQtd
                    };
                }

                return item;
            });

        });
    };

    const subtotal = itens.reduce(
        (acc, item) => acc + item.preco * item.qtd, 0
    );

    const taxaEntrega = itens.length > 0 ? 6.00 : 0;

    const desc = desconto ? subtotal * 0.10 : 0;

    const totalGeral = subtotal - desc + taxaEntrega;

    if (itens.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.tit}>
                        <TouchableOpacity onPress={(voltarpCardapio)}>
                            <Text style={styles.titulo}>← Meu Carrinho</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.vazioContainer}>
                    <Text style={styles.vazioTexto}>Seu carrinho está vazio</Text>
                    <Text style={styles.vazioSubtexto}>Adicione produtos pelo cardápio</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.foot}>T2 - Carrinho</Text>
                </View>
            </View>

        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.tit}>
                    <TouchableOpacity onPress={(voltarpCardapio)}>
                        <Text style={styles.titulo}>← Meu Carrinho</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {itens.map((item) => (
                    <View key={item.id} style={styles.itemCarrinho}>

                        <View style={styles.informacoes}>

                            <Text style={styles.nome}>
                                {item.nome}
                            </Text>

                            <Text style={styles.precoUnitario}>
                                R$ {formatarPreco(item.preco)}
                            </Text>

                        </View>

                        <View style={styles.colunaDireita}>
                            <View style={styles.controleQuantidade}>

                                <TouchableOpacity
                                    style={styles.botaoQuantidade}
                                    onPress={() => {
                                        alterarqtd(item.id, item.qtd - 1);
                                    }}
                                >
                                    <Text style={styles.textoQuantidade}>
                                        −
                                    </Text>
                                </TouchableOpacity>

                                <Text style={styles.quantidade}>
                                    {item.qtd}
                                </Text>

                                <TouchableOpacity
                                    style={styles.botaoQuantidade}
                                    onPress={() => {
                                        alterarqtd(item.id, item.qtd + 1);
                                    }}
                                >
                                    <Text style={styles.textoQuantidade}>
                                        +
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            <Text style={styles.valorUnMultiplicado}>
                                {formatarPreco(item.preco * item.qtd)}
                            </Text>
                        </View>

                    </View>

                ))}

                <View style={styles.cupomContainer}>
                    <Text style={styles.cupomTit}>
                        Possui cupom?
                    </Text>

                    <View style={styles.cupomLinha}>
                        <TextInput
                            style={styles.cupomInput}
                            placeholder='Digite seu cupom'
                            placeholderTextColor="#8a8a8a"
                            value={cupom}
                            onChangeText={(texto) => {
                                setCupom(texto);
                                setCupomErro('');
                            }}
                        />

                        <TouchableOpacity
                            style={styles.cupomBotao}
                            onPress={ativarDesc}>
                            <Text style={styles.aplicarcupom}>Aplicar</Text>
                        </TouchableOpacity>

                    </View>

                    {desconto && (
                        <Text style={styles.cupomSucesso}>10% OFF!</Text>
                    )}
                    {cupomErro !== '' && (
                        <Text style={styles.cupomErro}>{cupomErro}</Text>
                    )}

                </View>

            </ScrollView>

            <View style={styles.rodape}>
                <View style={styles.resumoLinha}>
                    <Text style={styles.totalTexto}>Subtotal:</Text>
                    <Text style={styles.totalValor}>R$ {formatarPreco(subtotal)}</Text>
                </View>

                {desconto && (
                    <View style={styles.resumoLinha}>
                        <Text style={styles.totalTexto}>Desconto:</Text>
                        <Text style={styles.totalValor}>- {formatarPreco(desc)}</Text>
                    </View>
                )}

                <View style={styles.resumoLinha}>
                    <Text style={styles.totalTexto}>Taxa de entrega:</Text>
                    <Text style={styles.totalValor}>R$ {formatarPreco(taxaEntrega)}</Text>
                </View>

                <View style={styles.resumoLinhaTotal}>
                    <Text style={styles.totalTextoFinal}>Total:</Text>
                    <Text style={styles.totalGeral}>R$ {formatarPreco(totalGeral)}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[
                    styles.botaoContinuar,
                    itens.length === 0 && styles.botaoDesabilitado
                ]}
                disabled={itens.length === 0}
                onPress={() => navigation.navigate('checkout', { total: totalGeral })}
            >
                <Text style={styles.textoContinuar}>
                    Continuar
                </Text>
            </TouchableOpacity>


            <View style={styles.footer}>
                <Text style={styles.foot}>T2 - Carrinho</Text>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    vazioContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    vazioTexto: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    vazioSubtexto: {
        fontSize: 14,
    },
    container: {
        flex: 1,
        margin: 20,
        justifyContent: 'space-between',
        fontSize: 14,
        color: cores.texto
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: cores.primaria,
        borderRadius: 20
    },
    titulo: {
        margin: 10,
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: cores.backgroundClaro,
        letterSpacing: 1
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    foot: {
        color: cores.primaria,
        fontWeight: 'bold'
    },

    itemCarrinho: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#bdbdbd',
        padding: 15
    },
    informacoes: {
        flex: 1,
        minWidth: 0
    },
    colunaDireita: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    controleQuantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center'
    },
    quantidade: {
        fontWeight: 'bold',
        fontSize: 16,
        color: cores.texto
    },
    botaoQuantidade: {
        minWidth: 28,
        alignItems: 'center',
        justifyContent: 'center'
    },

    nome: {
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 6
    },

    precoUnitario: {
        color: '#646464'
    },
    textoQuantidade: {
        borderWidth: 2,
        borderColor: cores.primaria,
        borderRadius: 5,
        paddingHorizontal: 8,
        backgroundColor: '#293eff27',
        fontSize: 18,
        fontWeight: 'bold',
        color: cores.primaria,
        minWidth: 24,
        textAlign: 'center'
    },
    valorUnMultiplicado: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000'
    },
    cupomContainer: {
        marginTop: 20,
        backgroundColor: '#f3f3f3',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#e3e3e3'
    },
    cupomTit: {
        fontSize: 15,
        fontWeight: '700',
        color: cores.texto,
        marginBottom: 10
    },
    cupomLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    cupomInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d5d5d5',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#fff',
        color: cores.texto,
        fontSize: 14
    },
    cupomBotao: {
        backgroundColor: cores.primaria,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    aplicarcupom: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13
    },
    cupomSucesso: {
        marginTop: 10,
        color: cores.sucesso,
        fontWeight: '700',
        fontSize: 13
    },
    cupomErro: {
        marginTop: 10,
        color: cores.erro,
        fontWeight: '600',
        fontSize: 13
    },
    rodape: {
        backgroundColor: '#e6e6e6',
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
        marginBottom: 12,
        borderWidth: 0,
        borderColor: '#e5e5e5'
    },
    resumoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    resumoLinhaTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    totalTexto: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500'
    },
    totalValor: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500'
    },
    totalTextoFinal: {
        fontSize: 17,
        color: '#111',
        fontWeight: '700'
    },
    totalGeral: {
        fontSize: 18,
        color: cores.sucesso,
        fontWeight: 'bold'
    },
    botaoContinuar: {
        backgroundColor: cores.primaria,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 10
    },
    textoContinuar: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    botaoDesabilitado: {
        opacity: 0.5
    }

});
