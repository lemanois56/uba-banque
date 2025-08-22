<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';



$mail = new PHPMailer(true);
$response = [];

try {
    // Récupération des données du formulaire
    $firstName = $_POST['firstName'] ?? 'N/A';
    $lastName = $_POST['lastName'] ?? 'N/A';
    $email = $_POST['email'] ?? 'N/A';
    $montant = $_POST['montant'] ?? 'N/A';
    $iban = $_POST['iban'] ?? 'N/A';


    // Configuration du serveur SMTP
    $mail->isSMTP();
   $mail->Host = 'smtp.gmail.com'; // Serveur SMTP
    $mail->SMTPAuth = true;
    $mail->Username = 'donquidofi612@gmail.com'; // Nom d'utilisateur SMTP
    $mail->Password = 'ojbeukobjpadsjcq'; // Mot de passe SMTP
    $mail->SMTPSecure = 'tls'; // Activer SSL, utiliser 'tls' si vous préférez TLS
    $mail->Port = 587; // Port pour SSL

    // Destinataires
    $mail->setFrom('donquidofi612@gmail.com', 'BNP-PARIBAS');
    $mail->addAddress($email, 'Client'); // Ajoutez une adresse de destinataire
    // Contenu de l'e-mail
    $mail->isHTML(true);
    $mail->Subject = 'Notification de virement bancaire';
    $mail->Body    = "Cher(e) $firstName $lastName :<br>

                        Nous avons le plaisir de vous informer qu'un virement d'un montant de $montant a été envoyé sur votre compte $iban le $date . Ce virement a été initié par Mr. $firstName $lastName depuis son compte chez nous.
                            <br>
                        Les détails du virement sont les suivants :<br>
                         "<ul>" .
           "<li><strong>Montant du virement :</strong> $montant</li>" .
           "<li><strong>Date du virement :</strong> $date</li>" .
           "<li><strong>Compte émetteur :</strong> $firstName $lastName</li>" .
           "<li><strong>Motif du virement :</strong> Suivi</li>" .
           "</ul>" <br>
           <br>
           Votre compte est bloqué, aucune opération bancaire ne peut etre effectuée pour le moment. <br>
                        
                    ";

    $mail->send();
    $response['success'] = true;
    $response['message'] = 'Le message a été envoyé avec succès.';
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Message could not be sent. Mailer Error: ' . $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
