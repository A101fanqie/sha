document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const phoneNote = document.querySelector('.phone-note');
    const passwordNote = document.querySelector('.password-note');

    // 监听手机号输入
    phoneInput.addEventListener('input', function() {
        phoneNote.style.display = 'block'; // 确保提示元素显示
        if (this.value.length === 0) {
            phoneNote.textContent = '请输入手机号码';
            phoneNote.style.color = '#666';
        } else if (this.value.length !== 11) {
            phoneNote.textContent = '手机号必须是11位！请仔细检查';
            phoneNote.style.color = '#ff4444';
        } else {
            phoneNote.textContent = '手机号格式正确！';
            phoneNote.style.color = '#4CAF50';
        }
    });

    // 监听密码输入
    passwordInput.addEventListener('input', function() {
        passwordNote.style.display = 'block'; // 确保提示元素显示
        if (this.value.length === 0) {
            passwordNote.textContent = '请输入密码';
            passwordNote.style.color = '#666';
        } else {
            passwordNote.textContent = '请再次确认密码是否正确，错误密码将无法完成服务！';
            passwordNote.style.color = '#ff4444';
        }
    });

    // 页面加载时显示初始提示
    phoneNote.textContent = '请输入手机号码';
    phoneNote.style.color = '#666';
    phoneNote.style.display = 'block';
    
    passwordNote.textContent = '请输入密码';
    passwordNote.style.color = '#666';
    passwordNote.style.display = 'block';

    // 修改表单提交处理
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
            product: document.getElementById('product').value,
            quantity: document.getElementById('quantity').value
        };

        // 先进行表单验证
        if (!validateForm(formData)) {
            return;
        }

        // 创建确认弹窗
        const confirmPopup = document.createElement('div');
        confirmPopup.className = 'confirm-popup';
        confirmPopup.innerHTML = `
            <p style="font-weight: bold; font-size: 16px; margin-bottom: 15px;">请确认以下信息：</p>
            <p style="margin-bottom: 10px;">手机号：${formData.phone}</p>
            <p style="margin-bottom: 20px;">密码：${formData.password}</p>
            <div class="confirm-buttons">
                <button type="button" onclick="this.closest('.confirm-popup').remove();" style="background: #999;">取消</button>
                <button type="button" onclick="handleConfirmSubmit(this)">确认提交</button>
            </div>
        `;
        document.body.appendChild(confirmPopup);
    });
});

// 处理确认提交
function handleConfirmSubmit(btn) {
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        product: document.getElementById('product').value,
        quantity: document.getElementById('quantity').value
    };

    // 创建订单对象
    const order = {
        ...formData,
        time: new Date().toLocaleString(),
        status: '新订单'
    };

    // 获取现有订单
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // 添加新订单
    orders.push(order);
    
    // 保存到localStorage
    localStorage.setItem('orders', JSON.stringify(orders));

    // 移除确认弹窗
    btn.closest('.confirm-popup').remove();

    // 显示成功提示
    const successPopup = document.createElement('div');
    successPopup.className = 'success-popup';
    successPopup.textContent = '订单提交成功！';
    document.body.appendChild(successPopup);

    // 2秒后移除提示
    setTimeout(() => {
        successPopup.remove();
    }, 2000);

    // 重置表单和提示信息
    document.getElementById('orderForm').reset();
    document.querySelector('.phone-note').textContent = '';
    document.querySelector('.password-note').textContent = '';
}

// 添加到全局作用域
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '隐藏';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '显示';
    }
}

function validateForm(data) {
    if (!data.name || !data.phone || !data.password || !data.product || !data.quantity) {
        alert('请填写所有必填项');
        return false;
    }

    // 严格验证手机号必须是11位
    if (data.phone.length !== 11) {
        alert('手机号必须是11位！');
        return false;
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
        alert('请输入正确的手机号码');
        return false;
    }

    return true;
} 