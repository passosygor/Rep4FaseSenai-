// DESAFIO 6 — Corrida Maluca Tática do Ligeirinho
function desafio6(corredores) {
    console.log('\n--- DESAFIO 6 ---');
    console.log('Corredores iniciais:', corredores);

    // 1. Adicione Papa-Léguas e Frajola, mas apenas se já houver pelo menos 1 corredor.
    if (corredores.length >= 1) {
        corredores.push('papa-leguas', 'frajola');
        console.log('Papa-Léguas e Frajola adicionados:', corredores);
    } else {
        console.log('Nenhum corredor, não adicionados.');
    }

    // 2. Ordene alfabeticamente apenas a partir do segundo elemento (manipulação parcial).
    if (corredores.length > 1) {
        let primeiro = corredores[0];
        let resto = corredores.slice(1);
        resto.sort();
        corredores = [primeiro, ...resto];
        console.log('Ordenado a partir do segundo elemento:', corredores);
    }

    // 3. Inverta o array somente se o primeiro nome tiver mais de 6 letras.
    if (corredores.length > 0 && corredores[0].length > 6) {
        corredores.reverse();
        console.log('Array invertido (primeiro nome > 6 letras):', corredores);
    } else {
        console.log('Primeiro nome tem 6 ou menos letras, não invertido.');
    }

    // 4. Pegue apenas os 2 primeiros lugares após ordenar novamente.
    let copiaOrdenada = [...corredores].sort();
    let primeiros2 = copiaOrdenada.slice(0, 2);
    console.log('2 primeiros após ordenar tudo:', primeiros2);

    // 5. Remova o último corredor se o nome começar com consoante.
    if (corredores.length > 0) {
        let ultimo = corredores[corredores.length - 1].toLowerCase();
        let primeiraLetra = ultimo[0];
        let vogais = ['a', 'e', 'i', 'o', 'u'];
        if (!vogais.includes(primeiraLetra)) {
            let removido = corredores.pop();
            console.log(`Último corredor (${removido}) removido por começar com consoante.`);
        } else {
            console.log('Último corredor começa com vogal, não removido.');
        }
    }

    console.log('Corredores finais:', corredores);
    return corredores;
}