package executor

type ExecuteRequest struct {
	Language string `json:"language"`
	Code     string `json:"code"`
	Stdin    string `json:"stdin"`
}

type ExecuteResult struct {
	Success        bool   `json:"success"`
	Status         string `json:"status"`
	Stdout         string `json:"stdout"`
	Stderr         string `json:"stderr"`
	ExitCode       int    `json:"exit_code"`
	ExecutionTimeMs int64  `json:"execution_time_ms"`
}
