import styled from 'styled-components';

const SaveButton = () => {
  return (
    <StyledWrapper>
      <button className="bookmarkBtn">
        <span className="IconContainer">
          <svg viewBox="0 0 384 512" height="0.9em" className="icon">
            <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
          </svg>
        </span>
        <p className="text">Save</p>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .bookmarkBtn {
    width: 100px;
    height: 40px;
    border-radius: 40px;
    border: 1px solid rgba(255, 255, 255, 0.349);
    background-color: rgb(12, 12, 12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
  }

  .IconContainer {
    width: 30px;
    height: 30px;
    background: linear-gradient(to bottom, rgb(255, 136, 255), rgb(172, 70, 255));
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 2;
    transition-duration: 0.3s;
  }

  .icon {
    border-radius: 1px;
  }

  .text {
    height: 100%;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 1;
    transition-duration: 0.3s;
    font-size: 1.04em;
  }

  .bookmarkBtn:hover .IconContainer {
    width: 90px;
    transition-duration: 0.3s;
  }

  .bookmarkBtn:hover .text {
    transform: translate(10px);
    width: 0;
    font-size: 0;
    transition-duration: 0.3s;
  }

  .bookmarkBtn:active {
    transform: scale(0.95);
    transition-duration: 0.3s;
  }`;

export default SaveButton;
