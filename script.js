<script>
        
        // Elementos DOM
        const dropArea = document.getElementById('dropArea');
        const fileInput = document.getElementById('fileInput');
        const selectFileBtn = document.getElementById('selectFileBtn');
        const takePictureBtn = document.getElementById('takePictureBtn');
        const fileList = document.getElementById('fileList');
        const cameraContainer = document.getElementById('cameraContainer');
        const cameraPreview = document.getElementById('cameraPreview');
        const captureBtn = document.getElementById('captureBtn');
        const cancelCameraBtn = document.getElementById('cancelCameraBtn');
        const capturedImage = document.getElementById('capturedImage');
        
        let stream;
        let selectedFiles = [];
        
        // Evento para selecionar arquivos ao clicar no botão
        selectFileBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Evento para quando arquivos são selecionados
        fileInput.addEventListener('change', handleFileSelect);
        
        // Função para lidar com arquivos selecionados
        function handleFileSelect(e) {
            const files = e.target.files;
            if (files.length === 0) return;
            
            // Adicionar os arquivos à lista
            addFilesToList(files);
        }
        
        // Função para adicionar arquivos à lista
        function addFilesToList(files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Verificar se o arquivo já existe na lista
                if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    continue;
                }
                
                selectedFiles.push(file);
                
                // Criar elemento de lista para o arquivo
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                const fileName = document.createElement('div');
                fileName.className = 'file-name';
                fileName.textContent = file.name;
                
                const fileRemove = document.createElement('div');
                fileRemove.className = 'file-remove';
                fileRemove.textContent = '×';
                fileRemove.onclick = function() {
                    // Remover o arquivo da lista
                    selectedFiles = selectedFiles.filter(f => f !== file);
                    fileList.removeChild(fileItem);
                };
                
                fileItem.appendChild(fileName);
                fileItem.appendChild(fileRemove);
                fileList.appendChild(fileItem);
            }
        }
        
        // Suporte para arrastar e soltar
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('highlight');
        }
        
        function unhighlight() {
            dropArea.classList.remove('highlight');
        }
        
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            addFilesToList(files);
        }
        
        // Funcionalidade da câmera
        takePictureBtn.addEventListener('click', startCamera);
        captureBtn.addEventListener('click', capturePhoto);
        cancelCameraBtn.addEventListener('click', stopCamera);
        
        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                cameraPreview.srcObject = stream;
                cameraContainer.style.display = 'block';
                capturedImage.style.display = 'none';
            } catch (err) {
                console.error("Erro ao acessar a câmera: ", err);
                alert("Não foi possível acessar a câmera. Verifique as permissões.");
            }
        }
        
        function capturePhoto() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = cameraPreview.videoWidth;
            canvas.height = cameraPreview.videoHeight;
            
            // Desenhar o frame atual no canvas
            context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
            
            // Converter para blob
            canvas.toBlob(blob => {
                const file = new File([blob], `documento_${new Date().toISOString()}.jpg`, { type: 'image/jpeg' });
                addFilesToList([file]);
                
                // Mostrar a imagem capturada
                capturedImage.src = URL.createObjectURL(blob);
                capturedImage.style.display = 'block';
                
                // Opcional: parar a câmera após a captura
                stopCamera();
            }, 'image/jpeg', 0.9);
        }
        
        function stopCamera() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            cameraContainer.style.display = 'none';
        }
        document.getElementById('militaryForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Formulário enviado com sucesso! Em breve entraremos em contato.');
        });
       
    </script>