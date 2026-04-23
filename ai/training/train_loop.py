import tensorflow as tf
import numpy as np
import time
from datetime import datetime

class CustomTrainer:
    """
    Custom training loop dengan tf.GradientTape
    """
    
    def __init__(self, model, loss_fn, learning_rate=0.001):
        self.model = model
        self.loss_fn = loss_fn
        self.optimizer = tf.keras.optimizers.Adam(learning_rate)
        self.train_losses = []
        self.val_losses = []
        
        # TensorBoard
        log_dir = "logs/gradient_tape/" + datetime.now().strftime("%Y%m%d-%H%M%S")
        self.writer = tf.summary.create_file_writer(log_dir)
    
    @tf.function
    def train_step(self, x_batch, y_batch):
        with tf.GradientTape() as tape:
            predictions = self.model(x_batch, training=True)
            loss = self.loss_fn(y_batch, predictions)
        
        gradients = tape.gradient(loss, self.model.trainable_variables)
        self.optimizer.apply_gradients(zip(gradients, self.model.trainable_variables))
        return loss, predictions
    
    def train(self, X_train, y_train, X_val, y_val, epochs=50, batch_size=32):
        n_samples = len(X_train)
        n_batches = int(np.ceil(n_samples / batch_size))
        
        print(f"\n🚀 Memulai Custom Training Loop")
        print(f"   Samples: {n_samples}, Epochs: {epochs}, Batch size: {batch_size}\n")
        
        for epoch in range(epochs):
            epoch_start = time.time()
            
            # Shuffle data
            indices = np.random.permutation(n_samples)
            X_shuffled = X_train[indices]
            y_shuffled = y_train[indices]
            
            # Training
            epoch_loss = 0.0
            for batch in range(n_batches):
                start = batch * batch_size
                end = min(start + batch_size, n_samples)
                
                x_batch = X_shuffled[start:end]
                y_batch = y_shuffled[start:end]
                
                loss, _ = self.train_step(x_batch, y_batch)
                epoch_loss += loss.numpy()
            
            avg_train_loss = epoch_loss / n_batches
            
            # Validasi
            val_predictions = self.model(X_val, training=False)
            val_loss = self.loss_fn(y_val, val_predictions).numpy()
            
            self.train_losses.append(avg_train_loss)
            self.val_losses.append(val_loss)
            
            # Log ke TensorBoard
            with self.writer.as_default():
                tf.summary.scalar('loss/train', avg_train_loss, step=epoch)
                tf.summary.scalar('loss/val', val_loss, step=epoch)
            
            epoch_time = time.time() - epoch_start
            print(f"Epoch {epoch+1:3d}/{epochs} | Loss: {avg_train_loss:.4f} | Val Loss: {val_loss:.4f} | Time: {epoch_time:.2f}s")
        
        return self.train_losses, self.val_losses

if __name__ == "__main__":
    print("✅ Custom Trainer (GradientTape) siap!")