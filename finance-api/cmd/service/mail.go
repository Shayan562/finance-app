package service

import (
	"os"

	"net/smtp"
)

func SendMail(receiverAddress string, Newpass string) error {

	// Choose auth method and set it up
	from := os.Getenv("EMAIL")
	pass := os.Getenv("APP_PASS")

	auth := smtp.PlainAuth("", from, pass, "smtp.gmail.com")

	to := []string{receiverAddress}
	subject := "Password Reset Request"
	body := "Please use the following password\n" +
		Newpass + "\n" +
		"We strongly recommend you to change your password after you login."

	// Format the email message
	msg := []byte("To: " + receiverAddress + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	// Send the email using Gmail's SMTP server
	err := smtp.SendMail("smtp.gmail.com:587", auth, from, to, msg)
	return err
}
