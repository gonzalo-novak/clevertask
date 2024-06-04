const pipeRoutes = (...fns: Function[]) => (...args: any) => fns.forEach(fn => fn(...args));

export {
	pipeRoutes
}
