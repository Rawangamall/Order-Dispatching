const PDFDocument = require('pdfkit');
const fs = require('fs');
const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/DriverModel");

const OrderSchema = mongoose.model("order");
const catchAsync = require("./../utils/CatchAsync");



exports.finalReport = catchAsync(async (request, response, next) => {
	const data = await OrderSchema.aggregate([
	  { $match: { Status: "delivered" } },
	  {
		$group: {
		  _id: "$DriverID",
		  count: { $sum: 1 },
		  totalTime: { $sum: { $toLong: "$updated_status" } },
		},
	  },
	  {
		$lookup: {
		  from: "drivers",
		  localField: "_id",
		  foreignField: "_id",
		  as: "driver",
		},
	  },
	  {
		$unwind: "$driver",
	  },
	  ...(request.headers.searchkey
		? [
			{
			  $match: {
				"driver.driverName": {
				  $regex: new RegExp(request.headers.searchkey, "i"),
				},
			  },
			},
		  ]
		: []),
	  {
		$project: {
		  _id: 0,
		  driverID: "$_id",
		  driverName: "$driver.driverName",
		  count: 1,
		  averageTime: {
			$dateToString: {
			  date: {
				$toDate: {
				  $multiply: [
					{ $divide: ["$totalTime", "$count"] },
					1000 * 60,
				  ],
				},
			  },
			  format: "%H:%M:%S",
			},
		  },
		},
	  },
	      { $sort: { averageTime: request.headers.sortvalue === 'desc' ? -1 : 1 } }
	]);
  
	response.status(200).json(data);
  });
  
 
  exports.generatePDF = catchAsync(async (request, response, next) => {
	const reportData = await OrderSchema.aggregate([
	  { $match:{ Status: "delivered" } },
	  {
		$group: {
		  _id: "$DriverID",
		  count: { $sum: 1 },
		  totalTime: { $sum: { $toLong: "$updated_status" } },
		},
	  },
	  {
		$lookup: {
		  from: "drivers",
		  localField: "_id",
		  foreignField: "_id",
		  as: "driver",
		},
	  },
	  {
		$unwind: "$driver",
	  },
	  {
		$project: {
		  _id: 0,
		  driverID: "$_id",
		  driverName: "$driver.driverName",
		  count: 1,
		  averageTime: {
			$dateToString: {
			  date: {
				$toDate: {
				  $multiply: [
					{ $divide: ["$totalTime", "$count"] },
					1000 * 60 ,
				  ],
				},
			  },
			  format: "%H:%M:%S",
			},
		  },
		},
	  },
	]);
  
	const doc = new PDFDocument();
	const fileName = 'report.pdf';
  
	doc.pipe(fs.createWriteStream(fileName));
  
	doc
	  .fillColor('#000')
	  .fontSize(20)
	  .text('Order Dispatching Report', { align: 'center' })
	  .moveDown(2);
  
	const tableTop = 150;
	const driverIDX = 50;
	const driverNameX = 150;
	const countX = 300;
	const averageTimeX = 400;
  
	// Styling for table headers
	doc
	  .fontSize(12)
	  .fillColor('#000')
	  .text('Driver ID', driverIDX, tableTop, { bold: true })
	  .text('Driver Name', driverNameX, tableTop, { bold: true })
	  .text('Count', countX, tableTop, { bold: true })
	  .text('Average Time', averageTimeX, tableTop, { bold: true });
  
	// Styling for table rows
	const rowHeight = 20;
	const contentTop = tableTop + rowHeight + 10;
  
	// Loop through the reportData and dynamically populate the table rows
	for (let i = 0; i < reportData.length; i++) {
	  const rowData = reportData[i];
	  const y = contentTop + i * rowHeight;
  
	  doc
		.fontSize(10)
		.fillColor('#000')
		.text(rowData.driverID, driverIDX, y, { background: i % 2 === 0 ? '#eee' : '#fff' })
		.text(rowData.driverName, driverNameX, y, { background: i % 2 === 0 ? '#eee' : '#fff' })
		.text(rowData.count.toString(), countX, y, { background: i % 2 === 0 ? '#eee' : '#fff' })
		.text(rowData.averageTime, averageTimeX, y, { background: i % 2 === 0 ? '#eee' : '#fff' });
	}
  
	doc.end();
  
	response.setHeader('Content-Type', 'application/pdf');
	response.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  
	const fileStream = fs.createReadStream(fileName);
	fileStream.pipe(response);
  });
  