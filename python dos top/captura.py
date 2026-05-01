import cv2
import os

# Cria a pasta 'saida/' se ela não existir
os.makedirs("saida", exist_ok=True)

# Inicia a captura da webcam (0 é a câmera padrão)
cap = cv2.VideoCapture(0)

# Coordenadas da área de recorte (x_inicial, y_inicial, x_final, y_final)
# Você pode alterar esses valores para mudar o tamanho e a posição do recorte
x1, y1 = 150, 100
x2, y2 = 450, 400

contador_imagens = 0 # Variável para contar e nomear arquivos diferentes

print("Pressione 's' para salvar a imagem ou 'q' para sair.")

while True:
    # Lê o frame atual da webcam
    sucesso, frame = cap.read()
    
    if not sucesso:
        print("Erro ao acessar a câmera.")
        break

    # Fazemos uma cópia do frame para desenhar o retângulo sem alterar a imagem original
    frame_exibicao = frame.copy()
    
    # Desenha o retângulo verde na imagem de exibição
    # cv2.rectangle(imagem, ponto_inicial, ponto_final, cor(BGR), espessura)
    cv2.rectangle(frame_exibicao, (x1, y1), (x2, y2), (0, 255, 0), 2)

    # Mostra a imagem com o retângulo na tela
    cv2.imshow("Webcam Ao Vivo", frame_exibicao)

    # Captura as teclas pressionadas (espera 1 milissegundo)
    tecla = cv2.waitKey(1) & 0xFF

    # Se a tecla 's' for pressionada, faz a captura e o recorte
    if tecla == ord('s'):
        contador_imagens += 1
        
        # O recorte usa fatiamento (slicing) de matrizes do numpy: frame[y1:y2, x1:x2]
        recorte = frame[y1:y2, x1:x2]
        
        # Nomes dos arquivos usando o contador para não sobrescrever
        nome_original = f"saida/original_{contador_imagens}.jpg"
        nome_recorte = f"saida/recorte_{contador_imagens}.jpg"
        
        # Salva a imagem original (limpa, sem o retângulo verde) e o recorte
        cv2.imwrite(nome_original, frame)
        cv2.imwrite(nome_recorte, recorte)
        
        # Mostra o recorte em uma segunda janela (Desafio Extra)
        cv2.imshow("Recorte Capturado", recorte)
        
        # Exibe no terminal quantas imagens foram salvas (Desafio Extra)
        print(f"[{contador_imagens}] Captura salva com sucesso! Arquivos: {nome_original} e {nome_recorte}")

    # Se a tecla 'q' for pressionada, encerra o loop
    elif tecla == ord('q'):
        print("Encerrando o programa...")
        break

# Libera a câmera e fecha todas as janelas do OpenCV corretamente
cap.release()
cv2.destroyAllWindows()