import { Hono } from 'hono'
import { cors } from 'hono/cors'

const accountRouter = require("./routes/account.route");
const employeesRouter = require("./routes/employee.route");
const consumablesRouter = require("./routes/consumables.route");
const modelRouter = require("./routes/model.route");
const loginRouter = require('./routes/login.route');
const meetingRouter = require('./routes/meeting.route');

const app = new Hono()

app.use('/server/*', cors())

app.get('/', async (c) => {
	return c.json({ message: 'Hello' })
})

app.route(`/server/login`, loginRouter);
app.route(`/server/account`, accountRouter);
app.route(`/server/employees`, employeesRouter);
app.route(`/server/consumables`, consumablesRouter);
app.route(`/server/model`, modelRouter);
app.route(`/server/meeting`, meetingRouter);


export default app