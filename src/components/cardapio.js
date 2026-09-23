import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, Image, View, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import produtos from './DBase/produtos.js';
import { cores } from '../temas.js';

const formatarPreco = (preco) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(preco);


export default function Cardapio({ navigation, route }) {
    const [contador, setContador] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            if (route.params?.itensAtualizados) {
                setContador(route.params.itensAtualizados);
                navigation.setParams({ itensAtualizados: undefined });
            }
        }, [route.params?.itensAtualizados])
    );

    const add = (produto) => {
        setContador((itensAtuais) => {

            const itemExiste = itensAtuais.find(
                (item) => item.id === produto.id
            );

            if (itemExiste) {
                return itensAtuais.map((item) =>
                    item.id === produto.id
                        ? {
                            ...item,
                            qtd: item.qtd + 1
                        }
                        : item
                );
            }

            return [
                ...itensAtuais,
                {
                    ...produto,
                    qtd: 1
                }
            ];
        });
    };

    const qtdTotal = contador.reduce((total, item) => total + item.qtd, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.tit}>
                    <Text style={styles.titulo}>DelivExpress</Text>
                </View>

                <TouchableOpacity
                    style={styles.contar}
                    onPress={() => {
                        navigation.navigate('carrinho', {
                            itensdocarrinho: contador
                        });
                    }}
                >
                    <Text style={styles.textoContador}>
                        {qtdTotal}
                    </Text>
                </TouchableOpacity>

            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.cinza}>


                    {produtos.map((produto) => (
                        <View style={styles.card} key={produto.id}>
                            <View style={styles.img}>
                                <Image source={produto.imagem} style={styles.imagem} />
                            </View>

                            <View style={styles.informacoes}>
                                <Text style={styles.nome}>{produto.nome}</Text>
                                <Text style={styles.descricao}>{produto.descricao}</Text>
                                <View style={styles.precobotao}>
                                    <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>

                                    <TouchableOpacity
                                        style={styles.botao}
                                        onPress={() => add(produto)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.textoBotao}>+ Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.foot}>T1 - Cardápio</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        justifyContent: 'space-between',
        fontSize: 14,
        color: '#f7f7f7',
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
    contar: {
        margin: 10,
        padding: 10,
        backgroundColor: cores.sucesso,
        width: 50,
        height: 50,
        borderRadius: 50
    },
    textoContador: {
        fontSize: 20,
        fontWeight: 'bold',
        color: cores.backgroundClaro,
        textAlign: 'center'
    },
    scrollContainer: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(19, 18, 18, 0.06)',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    img: {
        width: 120,
        height: 120
    },
    imagem: {
        backgroundColor: cores.backgroundClaro,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
        margin: 10,
    },
    informacoes: {
        flex: 1,
        padding: 16,
    },
    nome: {
        color: cores.texto,
        fontSize: 19,
        fontWeight: '700',
    },
    descricao: {
        color: cores.secundaria,
        fontSize: 14,
        lineHeight: 20,
        marginTop: 6,
    },
    precobotao: {
        flexDirection: 'row'
    },
    preco: {
        flex: 1.5,
        color: cores.erro,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 12,
    },
    botao: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: cores.sucesso,
        borderRadius: 50,
        marginTop: 14,
        padding: 12,
    },
    textoBotao: {
        color: cores.backgroundClaro,
        fontSize: 14,
        fontWeight: '700',
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    foot: {
        color: cores.primaria,
        fontWeight: 'bold'
    }

});
