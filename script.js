function toggleMenu(){
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle('active');
}

function toggleAnonymous(){
    const isAnonymous = document.getElementById('anonymous').checked;
    const donorDetails = document.getElementById('donorDetails');
    if(isAnonymous){
        donorDetails.style.display = 'none';
        document.getElementById('donorName').removeAttribute('required');
        document.getElementById('donorEmail').removeAttribute('required');
    } else{
        donorDetails.style.display = 'block';
        document.getElementById('donorName').setAttribute('required', 'required');
        document.getElementById('donorEmail').setAttribute('required', 'required');
    }
}

function handleDonation(event){
    event.preventDefault();
    const donationAmount = document.getElementById('donationAmount').value;
    const isAnonymous = document.getElementById('anonymous').checked;
    const donorName = document.getElementById('donorName').value;
    const donorEmail = document.getElementById('donorEmail').value;

    if (!donationAmount || donationAmount <= 0){
        alert('Please enter a valid donation amount!');
    }
    if (!isAnonymous && (!donorName || !donorEmail)){
        alert('Please fill in your name and email or choose to donate anonymously!');
    }

    const successMsg = document.getElementById('successMessage');
    successMsg.innerHTML = `Thank you for your $${donationAmount} donation! You're helping build stronger communities.`;
    successMsg.style.display = 'block';      
    
}
