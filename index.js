index.js
import TelegramBot from 'node-telegram-bot-api'; import { createClient } from '@supabase/supabase-js'; import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log("🤖 Bot iniciado...");

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log("Mensaje recibido:", text);

  const { error } = await supabase.from('transactions').insert([
    {
      description: text,
      date: new Date().toISOString(),
      amount: 0,
      category: 'test',
      type: 'manual'
    }
  ]);

  if (error) {
    console.log("Error:", error);
    bot.sendMessage(chatId, "❌ Error guardando en base");
  } else {
    bot.sendMessage(chatId, "✅ Guardado en Supabase");
  }
});
