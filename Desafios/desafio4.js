// DESAFIO 4 — O Show Rigoroso do Patolino
function desafio4(convidados) {
    console.log('\n--- DESAFIO 4 ---');
    console.log('Convidados iniciais:', convidados);

    // 1. Adicione Lola e Gaguinho apenas se não houver nomes repetidos.
    let temRepetido = convidados.some((nome, index) => convidados.indexOf(nome) !== index);
    if (!temRepetido) {
        convidados.push('lola', 'gaguinho');
        console.log('Lola e Gaguinho adicionados (sem repetições):', convidados);
    } else {
        console.log('Há nomes repetidos, não adicionados.');
    }

    // 2. Exiba todos os convidados com join, mas separados por “ | ”.
    console.log('Convidados:', convidados.join(' | '));

    // 3. Remova Gaguinho somente se ele estiver na última posição.
    if (convidados.length > 0 && convidados[convidados.length - 1].toLowerCase() === 'gaguinho') {
        convidados.pop();
        console.log('Gaguinho removido (última posição).');
    } else {
        console.log('Gaguinho não está na última posição ou não existe.');
    }

    // 4. Filtre convidados que tenham pelo menos duas letras iguais repetidas.
    let temLetraRepetida = (nome) => {
        let letras = nome.toLowerCase().split('');
        for (let i = 0; i < letras.length; i++) {
            if (letras.indexOf(letras[i]) !== letras.lastIndexOf(letras[i])) {
                return true;
            }
        }
        return false;
    };
    let comRepeticao = convidados.filter(temLetraRepetida);
    console.log('Convidados com letras repetidas:', comRepeticao);

    // 5. Conte quantos convidados têm exatamente 2 palavras no nome.
    let duasPalavras = convidados.filter(nome => nome.trim().split(/\s+/).length === 2);
    console.log('Convidados com exatamente 2 palavras:', duasPalavras.length);

    console.log('Convidados finais:', convidados);
    return convidados;
}
