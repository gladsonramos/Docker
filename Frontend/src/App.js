import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import UserList from './components/UserList.jsx';
import { Container, CircularProgress, Alert, TextField, Button, Checkbox, FormControlLabel, Box } from '@mui/material';

// Defina a variável base da API
const API_BASE_URL = 'http://54.145.17.35:5000'; // Alterar para o IP quando necessário

const fetchUsers = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/users`);
    return data;
};

const App = () => {

    const addUser = async (user) => {
        const endpoint = isRota ? `${API_BASE_URL}/api/users/rota` : `${API_BASE_URL}/api/users`;
        const { data } = await axios.post(endpoint, user);
        return data;
    };

    const { data: users, isLoading, error } = useQuery('users', fetchUsers);
    const { mutate: createUser } = useMutation(addUser);

    // State for the form fields and checkbox
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isRota, setIsRota] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create the user object
        const newUser = { name, email };

        // Call the mutation function to add the user
        createUser(newUser);

        // Reset the form fields (name, email), but don't reset isRota
        setName('');
        setEmail('');
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            {/* Carregamento e Erro */}
            {isLoading && <CircularProgress style={{ display: 'block', margin: '2rem auto' }} />}
            {error && <Alert severity="error">Erro ao carregar usuários</Alert>}

            {/* Lista de usuários */}
            {!isLoading && !error && <UserList users={users} />}

            {/* Formulário de Adição de Usuário */}
            <Box component="form" onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                <TextField
                    label="Nome"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                    required
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                    required
                />

                <FormControlLabel
                    control={<Checkbox checked={isRota} onChange={(e) => setIsRota(e.target.checked)} />}
                    label="Enviar para Rota"
                    style={{ marginBottom: '1rem' }}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Adicionar Usuário
                </Button>
            </Box>
        </Container>
    );
};

export default App;
