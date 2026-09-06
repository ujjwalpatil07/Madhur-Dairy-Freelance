import PDFDocument from "pdfkit";
import Order from "../models/OrderSchema.js";

export const generateOrderBillPDF = async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate({
      path: "address",
      populate: {
        path: "owner",
        model: "User",
        select: "username email",
      },
      select: "name phone addressType streetAddress city state pincode owner",
    })
    .populate({
      path: "productsData.productId",
      select: "name",
    });

  if (!order) return res.status(404).json({ message: "Order not found" });

  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  const formattedDate = new Date(order.createdAt).toISOString().split("T")[0]; // e.g., 2025-06-29

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Bill_${orderId}_${formattedDate}_${order.address.owner?.username || "user"}.pdf`
  );

  doc.pipe(res);
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#313131")
    .text("Madhur Dairy & Daily Needs", { align: "center" });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("gray")
    .text("Shed no. A-31, Datri Mala, Ambad,", { align: "center" })
    .text("MIDC Ambad, Nashik, Maharashtra 422010", { align: "center" })
    .text("+91 92091 43657 | contact@madhurdairy.com", { align: "center" })
    .moveDown(1.2);

  // Order Metadata
  const createdAtFormatted = new Date(order.createdAt).toLocaleString("en-IN");

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#000000")
    .text("Order Summary", { underline: true })
    .moveDown(0.5);

  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor("#000000")
    .text(`Order ID: ${order._id}`)
    .text(`Order Date: ${createdAtFormatted}`)
    .text(`Customer Username: ${order.address.owner?.username || "-"}`)
    .text(`Email: ${order.address.owner?.email || "-"}`)
    .text(`Payment Mode: ${order.paymentMode}`)
    .text(`Order Status: ${order.status}`);

  if (order.paymentMode === "Online" && order.razorpay?.paymentId) {
    doc
      .fontSize(11)
      .fillColor("gray")
      .text(`Razorpay Payment ID: ${order.razorpay.paymentId}`)
      .text(`Razorpay Order ID: ${order.razorpay.orderId}`);
  }

  doc.moveDown(1);

  // Delivery Address
  const addr = order.address;
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Delivery Address", { underline: true })
    .moveDown(0.3);

  doc
    .font("Helvetica")
    .fontSize(12)
    .text(`Name: ${addr.name}`)
    .text(`Address Type: ${addr.addressType}`)
    .text(`Phone: ${addr.phone}`)
    .text(
      `Address: ${addr.streetAddress}, ${addr.city}, ${addr.state} - ${addr.pincode}`
    )
    .moveDown(1);

  // Product Table Header
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Ordered Items", { underline: true })
    .moveDown(0.5);

  const tableTop = doc.y;
  const itemX = 50;
  const qtyX = 270;
  const priceX = 340;
  const subtotalX = 440;

  doc
    .fontSize(12)
    .text("Product", itemX, tableTop)
    .text("Qty", qtyX, tableTop, { width: 40, align: "right" })
    .text("Price", priceX, tableTop, { width: 60, align: "right" })
    .text("Subtotal", subtotalX, tableTop, { width: 80, align: "right" });

  doc
    .moveTo(itemX, doc.y + 2)
    .lineTo(550, doc.y + 2)
    .stroke();

  let y = doc.y + 6;
  let grandTotal = 0;

  order.productsData.forEach((item) => {
    const p = item.productId;
    const quantity = item.productQuantity;
    const price = item.productPrice;
    const subtotal = price * quantity;
    grandTotal += subtotal;

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(p.name, itemX, y)
      .text(quantity.toString(), qtyX, y, { width: 40, align: "right" })
      .text(`₹${price.toFixed(2)}`, priceX, y, { width: 60, align: "right" })
      .text(`₹${subtotal.toFixed(2)}`, subtotalX, y, {
        width: 80,
        align: "right",
      });

    y += 20;
  });

  doc.moveTo(itemX, y).lineTo(550, y).stroke();

  y += 10;
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(`Grand Total: ₹${grandTotal.toFixed(2)}`, subtotalX, y, {
      width: 80,
      align: "right",
    });

  // Footer
  doc
    .moveDown(3)
    .font("Helvetica-Oblique")
    .fontSize(10)
    .fillColor("gray")
    .text("Thank you for shopping with Madhur Dairy & Daily Needs.", {
      align: "center",
    })
    .text("We look forward to serving you again!", { align: "center" });

  doc.end();
};
