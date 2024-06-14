package service

import (
	"fmt"
	"os"

	"github.com/go-mail/mail"
)

func SendMail(receiverAddress string, newPass string) error {

	// Choose auth method and set it up
	from := os.Getenv("EMAIL")
	pass := os.Getenv("APP_PASS")

	messageTemplate :=
		`
    <h1 style="text-align: center;">Forgot Your Password?</h1>

    <p style="text-align: center;">Not to worry, we got you! We got you a new password.</p>
    <p style="text-align: center; font-size: 1.2em ;"><b>%v</b></p>
    <p style="text-align: center;">Use the password provided above to login. We <b>strongly</b> recommend you to change it after loging in.</p>
	`
	messageTemplate = fmt.Sprintf(messageTemplate, newPass)

	m := mail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", receiverAddress)
	m.SetHeader("Subject", "Password Reset Request")
	m.SetBody("text/html", messageTemplate)
	d := mail.NewDialer("smtp.gmail.com", 587, from, pass)

	// Send the email to Kate, Noah and Oliver.

	err := d.DialAndSend(m)

	return err
}
