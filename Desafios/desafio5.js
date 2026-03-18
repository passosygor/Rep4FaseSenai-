// DESAFIO 5 — O Clube Supersecreto do Frajola
function desafio5(clube) {
    console.log('\n--- DESAFIO 5 ---');
    console.log('Clube inicial:', clube);

    // 1. Adicione Piu-Piu somente se não existir ninguém com menos de 5 letras.
    let temMenos5 = clube.some(nome => nome.length < 5);
    if (!temMenos5) {
        clube.push('piu-piu');
        console.log('Piu-Piu adicionado (ninguém com menos de 5 letras):', clube);
    } else {
        console.log('Existe alguém com menos de 5 letras, Piu-Piu não adicionado.');
    }

    // 2. Adicione Hector apenas se algum membro for ave OU roedor (você define).
    let aves = ['piu-piu', 'patolino', 'papa-leguas'];
    let roedores = ['pernalonga', 'tina', 'ligeirinho'];
    let temAveOuRoedor = clube.some(nome => 
        aves.includes(nome.toLowerCase()) || roedores.includes(nome.toLowerCase())
    );
    if (temAveOuRoedor) {
        clube.push('hector');
        console.log('Hector adicionado (ave ou roedor presente):', clube);
    } else {
        console.log('Nenhum ave ou roedor, Hector não adicionado.');
    }

    // 3. Insira Ligeirinho logo após Piu-Piu, mas somente se ambos não estiverem no final.
    let indexPiu = clube.findIndex(nome => nome.toLowerCase() === 'piu-piu');
    if (indexPiu !== -1 && indexPiu !== clube.length - 1) {
        if (!clube.some(n => n.toLowerCase() === 'ligeirinho')) {
            clube.splice(indexPiu + 1, 0, 'ligeirinho');
            console.log('Ligeirinho inserido após Piu-Piu.');
        } else {
            console.log('Ligeirinho já existe, não inserido.');
        }
    } else {
        console.log('Piu-Piu não encontrado ou está no final, Ligeirinho não inserido.');
    }

    // 4. Remova Hector somente se o nome tiver número ímpar de caracteres.
    let indexHector = clube.findIndex(nome => nome.toLowerCase() === 'hector');
    if (indexHector !== -1 && clube[indexHector].length % 2 !== 0) {
        clube.splice(indexHector, 1);
        console.log('Hector removido (nome com número ímpar de caracteres).');
    } else {
        console.log('Hector não removido (não existe ou nome com par de caracteres).');
    }

    // 5. Gere nova lista com nomes em maiúsculas, mas só para membros com letra “i”.
    let comI = clube.filter(nome => nome.toLowerCase().includes('i'));
    let maiusculas = comI.map(nome => nome.toUpperCase());
    console.log('Nomes com "i" em maiúsculas:', maiusculas);

    console.log('Clube final:', clube);
    return clube;
}