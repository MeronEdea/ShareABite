function toggleMenu(){
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle('active');
}

function toggleAnonymous(){
    const isAnonymous = document.getElementById('anonymous').checked;
    const donorInfo = document.getElementById('donorInfo');
    if(isAnonymous){
        donorInfo.style.display = 'none';
        document.getElementById('donorName').removeAttribute('required');
        document.getElementById('donorEmail').removeAttribute('required');
    } else{
        donorInfo.style.display = 'block';
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
}
