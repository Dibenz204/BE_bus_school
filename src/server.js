const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
require('dotenv').config()
const mysql = require('mysql2')
const configViewEngine = require('./config/viewEngine');
const connectDB = require('./config/connectDB');

const userRoutes = require('./routes/userRoutes.js');
const webRoutes = require('./routes/webRoutes.js');

const cors = require('cors');


const app = express()                                //es modules

app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

//Dùng để lấy dữ liệu từ form gửi lên (body)
//Nếu ko có đoạn này thì req.body sẽ là undefined --> xem file homecotroller.js để rõ hơn
//app.use(express.urlencoded({ extended: false })); //khi extended là false thì chỉ nhận các giá trị dạng string hoặc array
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 5000
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



connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
})