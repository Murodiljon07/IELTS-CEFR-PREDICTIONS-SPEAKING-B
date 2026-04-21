import axios from "axios";
import prisma from "../config/database";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

export const sendTelegramOrder = async (order: any, user: any) => {
  try {
    const itemsList = order.items
      .map(
        (item: any) =>
          `📖 ${item.material.title} x${item.quantity} - $${item.price}`,
      )
      .join("\n");

    const message = `
🆕 *NEW ORDER RECEIVED* 🆕

*Order ID:* ${order.id}
*Customer:* ${user.name}
*Email:* ${user.email}
*Phone:* ${user.phone || "Not provided"}

*Items:*
${itemsList}

*Total:* $${order.total}
*Payment Method:* ${order.paymentMethod}

*Date:* ${new Date().toLocaleString()}

⚠️ *Status:* PENDING
    `;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      },
    );

    // Save payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        method: order.paymentMethod,
        status: "PENDING",
        telegramChatId: ADMIN_CHAT_ID,
      },
    });

    console.log("Telegram notification sent for order:", order.id);
  } catch (error) {
    console.error("Telegram send error:", error);
  }
};

export const sendActivationCodeToUser = async (
  chatId: string,
  code: string,
  materials: any[],
) => {
  try {
    const materialsList = materials.map((m) => `• ${m.title}`).join("\n");

    const message = `
🎉 *Activation Code Generated!* 🎉

*Your 6-digit code:* \`${code}\`

*Materials included:*
${materialsList}

*Instructions:*
1. Go to your cart page
2. Click "Activate" button
3. Enter this code

*Note:* This code can only be used once and expires in 30 days.

*GoodTesting Team* 🎓
    `;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      },
    );
  } catch (error) {
    console.error("Telegram send code error:", error);
  }
};
