const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
require('dotenv').config()
const mysql = require('mysql2')
const http = require('http');
const configViewEngine = require('./config/viewEngine');
const connectDB = require('./config/connectDB');
require('./cronJob.js')

const userRoutes = require('./routes/userRoutes.js');
const webRoutes = require('./routes/webRoutes.js');
const busStop = require('./routes/busStopRoute.js')
const Route = require('./routes/routeRoute.js');
const driverRoutes = require('./routes/driverRoute.js');
const scheduleRoutes = require('./routes/scheduleRoutes.js')
const dashBoardRoute = require('./routes/dashboardRoute.js');
const studentRoute = require('./routes/studentRoute.js');
const busRoute = require('./routes/busRoute.js');
const notificationRoute = require('./routes/notificationRoute.js');
const evaluateRoute = require('./routes/evaluateRoute.js');
const requestRoute = require('./routes/requestRoute.js');

const { initSocketServer } = require('./socketServer');

const cors = require('cors');


const app = express()                                //es modules
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// const Socketserver = http.createServer(app);
// initSocketServer(Socketserver);

// Cách này chỉ để 1 cor thôi, là để nối với frontend
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));


//Cho phép nhiều origins trong CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  // process.env.FRONTEND_URL_VERCEL, // Vercel URL sẽ set vào đây
  'https://bus-smart-school.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


//Dùng để lấy dữ liệu từ form gửi lên (body)
//Nếu ko có đoạn này thì req.body sẽ là undefined --> xem file homecotroller.js để rõ hơn
//app.use(express.urlencoded({ extended: false })); //khi extended là false thì chỉ nhận các giá trị dạng string hoặc array
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 5001
const host = process.env.HOST || 'localhost'



configViewEngine(app); //Gọi hàm cấu hình view engine
//-----------------------------------------------------------------------------
//Đã được thay thế bằng đoạn code bên file config/viewEngine.js
// config template engine (Đống này được lưu bên file config/viewEngine.js và được gọi ở trên) 
// app.set('views', path.join(__dirname, 'views'));  // chỉ định thư mục chứa file ejs
// app.set('view engine', 'ejs')
// config static files (css, js, images)
// app.use(express.static(path.join(__dirname, 'public')));      //chỉ định thư mục chứa file tĩnh
//app.use(express.static('public')); //cách viết khác, chỉ định thư mục chứa file tĩnh

app.use('/user/api', userRoutes);
app.use('/api/bus-stop', busStop);
app.use('/api/route', Route);
app.use('/api/driver', driverRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/dashboard', dashBoardRoute);
app.use('/api/student', studentRoute);
app.use('/api/bus', busRoute);
app.use('/api/notification', notificationRoute);
app.use('/api/evaluate', evaluateRoute);
app.use('/api/request', requestRoute);
app.use('/', webRoutes); //Cấu hình route, '' nghĩa là ko có tiền tố gì cả, nếu muốn có tiền tố thì thay '' thành '/api' chẳng hạn
//Ví dụ: nếu để app.use('/hehe', webRoutes); thì khi chạy, nó sẽ là localhost:5000/hehe/........ rồi mới tới các đường dẫn khác phía sau
//-----------------------------------------------------------------------------
// Đã được thay thế bằng đoạn code bên file routes/web.js

//routes - Có thể tạo ra nhiều routes khác nhau, chỉ cần thay đổi '/' thành tên route mong muốn
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// //Ví dụ về route khác
// app.get('/api', (req, res) => {
//   // res.send('Hello API!') //chỉ được chọn 1 trong 2 cú pháp, ko thể song song res.send và res.render
//   // res.json({ name: 'John', age: 30, city: 'New York' }) //trả về json
//   res.render('sample.ejs') //trả về file ejs
// })



// Health check endpoint - để Render/Railway biết server còn sống
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    socketIO: 'Active'
  });
});

connectDB().then(() => {
  initSocketServer(server);

  // app.listen(port, host, () => {
  //   console.log(`🚀 Server running on ${host}:${port}`);
  // });
  server.listen(port, host, () => {
    console.log(`🚀 Server running on ${host}:${port}`);
    console.log(`🔌 Socket.IO ready on ws://${host}:${port}/gps`);
  });

}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);


});