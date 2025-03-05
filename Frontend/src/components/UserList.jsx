import React from 'react';
import { List, ListItem, ListItemText, Typography, Paper } from '@mui/material';

const UserList = ({ users }) => {
    return (
        <>
            <Typography variant="h4" gutterBottom>
                Usuários Listados
            </Typography>
            <Paper elevation={5} style={{ padding: '1rem' }}>
                <List>
                    {users.map((user) => (
                        <ListItem key={user.id} divider>
                            <ListItemText primary={user.name} secondary={user.email} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </>
    );
};

export default UserList;