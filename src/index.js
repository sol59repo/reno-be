import { Hono } from 'hono'
const accountRouter = require("./routes/account.route");
const employeesRouter = require("./routes/employee.route");
const consumablesRouter = require("./routes/consumables.route");
const loginRouter = require('./routes/login.route');

const app = new Hono()

app.get('/', async (c) => {
	return c.json({ message: 'Hello' })
})

app.route(`/server/login`, loginRouter);
app.route(`/server/account`, accountRouter);
app.route(`/server/employees`, employeesRouter);
app.route(`/server/consumables`, consumablesRouter);


export default app