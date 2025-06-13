class AuthManager {
    constructor() {
        this.apiUrl = 'http://localhost:3030/api';
        this.currentUser = null;
        this.token = localStorage.getItem('authToken');
    }

    async init() {
        if (this.token) {
            try {
                await this.fetchUserInfo();
                this.showUserInfo();
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                this.showAuthModal();
            }
        } else {
            this.showAuthModal();
        }
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.add('active');
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('active');
    }

    showUserInfo() {
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        const userBalance = document.getElementById('userBalance');

        userName.textContent = this.currentUser.username;
        userBalance.textContent = `$${this.currentUser.balance.toLocaleString()}`;
        userInfo.style.display = 'block';
    }

    async register(username, password) {
        try {
            const response = await fetch(`${this.apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            this.token = data.token;
            localStorage.setItem('authToken', this.token);
            this.currentUser = {
                username: data.username,
                balance: data.balance,
            };

            this.hideAuthModal();
            this.showUserInfo();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            this.token = data.token;
            localStorage.setItem('authToken', this.token);
            this.currentUser = {
                username: data.username,
                balance: data.balance,
            };

            this.hideAuthModal();
            this.showUserInfo();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async fetchUserInfo() {
        const response = await fetch(`${this.apiUrl}/user`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        this.currentUser = data;
    }

    logout() {
        localStorage.removeItem('authToken');
        this.token = null;
        this.currentUser = null;
        location.reload();
    }

    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();
    window.authManager = authManager;

    authManager.init();

    const authForm = document.getElementById('authForm');
    const authError = document.getElementById('authError');
    const authTitle = document.getElementById('authTitle');
    const authSubmit = document.getElementById('authSubmit');
    const authToggle = document.getElementById('authToggle');
    const logoutButton = document.getElementById('logoutButton');

    let isLoginMode = true;

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.style.display = 'none';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = isLoginMode
            ? await authManager.login(username, password)
            : await authManager.register(username, password);

        if (!result.success) {
            authError.textContent = result.error;
            authError.style.display = 'block';
        }
    });

    authToggle.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        authTitle.textContent = isLoginMode ? 'Login to Zoldem Poker' : 'Register for Zoldem Poker';
        authSubmit.textContent = isLoginMode ? 'Login' : 'Register';
        authToggle.innerHTML = isLoginMode
            ? "Don't have an account? <a href='#'>Register</a>"
            : "Already have an account? <a href='#'>Login</a>";
        authError.style.display = 'none';
    });

    logoutButton.addEventListener('click', () => {
        authManager.logout();
    });
});