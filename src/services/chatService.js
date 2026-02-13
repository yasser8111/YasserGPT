// import { db } from "../firebase";
// import { 
//   collection, query, orderBy, getDocs, 
//   deleteDoc, doc, addDoc, serverTimestamp, 
//   onSnapshot 
// } from "firebase/firestore";

// export const getConversations = (userId, callback) => {
//   const convRef = collection(db, "users", userId, "conversations");
//   const q = query(convRef, orderBy("createdAt", "desc"));
//   return onSnapshot(q, (snapshot) => {
//     const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     callback(convs);
//   });
// };

// export const deleteConversation = async (userId, chatId) => {
//   const docRef = doc(db, "users", userId, "conversations", chatId);
//   await deleteDoc(docRef);
// };

// export const getMessages = async (userId, chatId) => {
//   const msgRef = collection(db, "users", userId, "conversations", chatId, "messages");
//   const q = query(msgRef, orderBy("createdAt", "asc"));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => doc.data());
// };

// export const saveMessage = async (userId, chatId, message) => {
//   const msgRef = collection(db, "users", userId, "conversations", chatId, "messages");
//   await addDoc(msgRef, {
//     ...message,
//     createdAt: serverTimestamp(),
//   });
// };

// export const createNewChat = async (userId, firstMessage) => {
//   const convRef = collection(db, "users", userId, "conversations");
//   const newChat = await addDoc(convRef, {
//     title: firstMessage.substring(0, 30) || "New Chat",
//     createdAt: serverTimestamp(),
//   });
//   return newChat.id;
// };