        // Panier
        let cart = [];
        
        // Afficher/Masquer les catégories
        function toggleCategory(element) {
            const category = element.parentElement;
            const serviceList = category.querySelector('.service-list');
            const arrow = category.querySelector('.arrow');
            
            if (serviceList.style.display === 'block') {
                serviceList.style.display = 'none';
                category.classList.remove('category-open');
            } else {
                serviceList.style.display = 'block';
                category.classList.add('category-open');
            }
        }
        
        // Ajouter au panier
        function addToCart(name, price) {
            cart.push({ name, price, quantity: 1 });
            updateCart();
            
            // Animation feedback
            const button = event.target;
            button.textContent = '✓ Ajouté';
            button.style.background = '#27ae60';
            setTimeout(() => {
                button.textContent = 'Réserver';
                button.style.background = '';
            }, 1500);
        }
        
        // Ajouter des heures au panier
        function addHoursToCart(name, pricePerHour, button) {
            const input = button.previousElementSibling;
            const hours = parseInt(input.value);
            const price = pricePerHour * hours;
            
            cart.push({ 
                name: `${name} (${hours}h)`, 
                price, 
                quantity: 1 
            });
            updateCart();
            
            // Animation feedback
            button.textContent = '✓ Ajouté';
            button.style.background = '#27ae60';
            setTimeout(() => {
                button.textContent = 'Réserver';
                button.style.background = '';
            }, 1500);
        }
        
        // Mettre à jour le panier
        function updateCart() {
            const cartItems = document.getElementById('cart-items');
            const cartCount = document.getElementById('cart-count');
            const cartTotal = document.getElementById('cart-total');
            const totalAmount = document.getElementById('total-amount');
            
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Votre panier est vide</div>';
                cartTotal.style.display = 'none';
            } else {
                let total = 0;
                
                cart.forEach((item, index) => {
                    total += item.price * item.quantity;
                    
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <div class="cart-item-info">
                            <div>${item.name}</div>
                            <div style="font-size:0.9em">${item.price} €</div>
                        </div>
                        <span class="remove-item" onclick="removeFromCart(${index})">✕</span>
                    `;
                    
                    cartItems.appendChild(itemElement);
                });
                
                totalAmount.textContent = total;
                cartTotal.style.display = 'block';
            }
            
            cartCount.textContent = cart.length;
        }
        
        // Retirer du panier
        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCart();
        }
        
        // Commander
        document.getElementById('checkout').addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Votre panier est vide !');
                return;
            }
            
            let message = 'RÉCAPITULATIF DE COMMANDE\n\n';
            let total = 0;
            
            // Group similar items
            const groupedItems = {};
            cart.forEach(item => {
                const key = item.name + item.price;
                if (!groupedItems[key]) {
                    groupedItems[key] = {...item, quantity: 1};
                } else {
                    groupedItems[key].quantity++;
                }
                total += item.price;
            });
            
            // Build message
            Object.values(groupedItems).forEach(item => {
                message += `- ${item.name} x${item.quantity} : ${item.price * item.quantity} €\n`;
            });
            
            message += `\nTOTAL : ${total} €\n\n`;
            message += 'Merci pour votre commande ! Un professionnel vous contactera dans les 24h pour confirmer le rendez-vous.';
            
            alert(message);
            cart = [];
            updateCart();
            
            // Redirection fictive
            // window.location.href = "confirmation.html";
        });
        
        // Ouvrir la première catégorie par défaut
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelector('.service-category h2').click();
        });
