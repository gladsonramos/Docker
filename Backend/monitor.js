import chokidar from 'chokidar';
import fs from 'fs';
import { execSync } from 'child_process';

const logFile = 'file_changes.log';

// Monitora todas as alterações na pasta do projeto
const watcher = chokidar.watch('.', {
    ignored: /node_modules|\.git/,
    persistent: true
});

watcher
    .on('change', path => logChange('Arquivo modificado', path))
    .on('add', path => logChange('Novo arquivo criado', path))
    .on('unlink', path => logChange('Arquivo deletado', path));

function logChange(event, path) {
    let diff = '';

    // Se for uma alteração, pega as mudanças com Git diff
    if (event === 'Arquivo modificado') {
        try {
            diff = execSync(`git diff "${path}"`).toString();
        } catch (error) {
            diff = 'Erro ao obter diff';
        }
    }

    const logEntry = `${new Date().toISOString()} - ${event}: ${path}\n${diff}\n`;
    console.log(logEntry);
    fs.appendFileSync(logFile, logEntry);
}

console.log('🛠️ Monitorando alterações no código...');
