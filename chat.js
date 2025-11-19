// Minimal Firebase Chat
document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();
    const chatRoomId = 'shareabite_demo_chat';
    const userId = 'user_' + Math.random().toString(36).substr(2, 6);
    
    // Chat elements
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    
    // Toggle functionality
    document.getElementById('chatToggle').addEventListener('click', function() {
        document.getElementById('chatWidget').classList.toggle('collapsed');
    });
    
    // Send message
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        await db.collection('chats').doc(chatRoomId).collection('messages').add({
            text: text,
            userId: userId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        chatInput.value = '';
    }
    
    // Listen for messages
    db.collection('chats').doc(chatRoomId).collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            chatMessages.innerHTML = '';
            snapshot.forEach((doc) => {
                const msg = doc.data();
                const element = document.createElement('div');
                element.classList.add('message', msg.userId === userId ? 'sent' : 'received');
                element.innerHTML = `<p>${msg.text}</p>`;
                chatMessages.appendChild(element);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    
    // Event listeners
    sendMessageBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
});