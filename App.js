import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [users, setUsers] = useState([]);

    const buscarEndereco = async () => {
        if (cep.length < 8) {
            Alert.alert('Erro', 'CEP inválido!');
            return;
        }
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data.erro) {
                Alert.alert('Erro', 'CEP não encontrado!');
            } else {
                const { logradouro, bairro, localidade, uf } = response.data;
                setEndereco(`${logradouro}, ${bairro}, ${localidade} - ${uf}`);
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao buscar o endereço!');
        }
    };

    const cadastrarUsuario = async () => {
        if (!cpf || !nome || !idade || !cep || !endereco) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return;
        }
        try {
          await axios.post('http://<192.168.15.11>:3000/users', {
            cpf,
            nome,
            idade: parseInt(idade),
            cep,
        });
            Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
            listarUsuarios();
        } catch (error) {
            Alert.alert('Erro', 'Falha ao cadastrar usuário!');
        }
    };

    const listarUsuarios = async () => {
        try {
            const response = await axios.get('http://<seu-ip-local>:3000/users');
            setUsers(response.data);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao listar usuários!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Usuários</Text>
            <TextInput
                style={styles.input}
                placeholder="CPF"
                value={cpf}
                onChangeText={setCpf}
            />
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.input}
                placeholder="Idade"
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="CEP"
                value={cep}
                onChangeText={setCep}
                onBlur={buscarEndereco}
            />
            <TextInput
                style={styles.input}
                placeholder="Endereço"
                value={endereco}
                editable={false}
            />
            <Button
                title="Cadastrar"
                onPress={cadastrarUsuario}
                color="#7a5f9b"
            />
            <Button
                title="Listar Usuários"
                onPress={listarUsuarios}
                color="#7a5f9b"
            />

            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.nome} - {item.cpf}</Text>
                        <Text>{item.endereco}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f0a35',
        justifyContent: 'center',
        alignItems: 'center',
    
    },
    card: {
        width: '100%',
        backgroundColor: '#402f5a',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        backgroundColor: '#5e4b72', 
        borderRadius: 8,
        fontSize: 16,
        color: '#fff',
        marginBottom: 15,
    },
    button: {
        height: 50,
        backgroundColor: '#402f5a', 
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});



